import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, encryptSession, setSessionCookie } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security";

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(60, "Name is too long"),
    email: z.string().trim().email("Please enter a valid email address").toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function POST(request: NextRequest) {
  // 1. Rate Limit Check (10 attempts per min in prod, 100 in dev)
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const limit = process.env.NODE_ENV === "production" ? 10 : 100;
  const rateLimit = checkRateLimit(ip, limit, 60000);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": rateLimit.limit.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": rateLimit.reset.toString(),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Invalid registration data";
      return NextResponse.json(
        { error: firstError, details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // 2. Check for duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    // 3. Hash Password (bcrypt)
    const passwordHash = await hashPassword(password);

    // 4. Create User with role READER
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "READER",
      },
    });

    // 5. Generate Session JWT & set HttpOnly Cookie
    const sessionToken = await encryptSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      avatarUrl: user.avatarUrl,
    });

    await setSessionCookie(sessionToken);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Reader registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}
