import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";
import { Role } from "@prisma/client";

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
  role: z.nativeEnum(Role),
  bio: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only Admin can list authors/users
  if (session.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: { articles: true },
        },
      },
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Fetch users API error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only Admin can create authors/users
  if (session.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const result = createUserSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { email, name, password, role, bio, avatarUrl } = result.data;

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      return NextResponse.json({ error: "User email already exists" }, { status: 400 });
    }

    // Hash Password
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Create user API error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
