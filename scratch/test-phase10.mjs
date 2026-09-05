// scratch/test-phase10.mjs
const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("=== PHASE 10 COMPREHENSIVE VERIFICATION SUITE ===");
  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${name}`);
      failed++;
    }
  }

  // Helper to extract cookies from set-cookie header
  function getCookie(response) {
    const setCookie = response.headers.get("set-cookie");
    if (!setCookie) return "";
    return setCookie.split(";")[0];
  }

  const timestamp = Date.now();
  const testEmail = `reader_${timestamp}@example.com`;
  const testPassword = "Password123!";

  // 1. Test Admin Login
  try {
    const adminRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@frontendexpert.com",
        password: "adminpassword123",
      }),
    });
    const adminData = await adminRes.json();
    assert(adminRes.ok && adminData.user.role === "ADMIN", "1. Existing Admin Login works and returns ADMIN role");
  } catch (e) {
    assert(false, `1. Existing Admin Login failed: ${e.message}`);
  }

  // 2. Test Guest Unauthenticated Bookmark attempt
  try {
    const guestRes = await fetch(`${BASE_URL}/api/bookmarks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleSlug: "first-post" }),
    });
    assert(guestRes.status === 401, "2. Guest bookmark attempt rejected with 401 Unauthorized");
  } catch (e) {
    assert(false, `2. Guest bookmark check failed: ${e.message}`);
  }

  // 3. Test Reader Registration
  let readerCookie = "";
  try {
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Reader",
        email: testEmail,
        password: testPassword,
        confirmPassword: testPassword,
      }),
    });
    const regData = await regRes.json();
    readerCookie = getCookie(regRes);
    assert(
      regRes.status === 201 && regData.user.role === "READER" && readerCookie.includes("__session"),
      "3. Reader registration creates account with READER role and sets __session cookie"
    );
  } catch (e) {
    assert(false, `3. Reader registration failed: ${e.message}`);
  }

  // 4. Test Duplicate Email Registration (Conflict)
  try {
    const dupRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Duplicate User",
        email: testEmail,
        password: testPassword,
        confirmPassword: testPassword,
      }),
    });
    assert(dupRes.status === 409, "4. Duplicate email registration rejected with 409 Conflict");
  } catch (e) {
    assert(false, `4. Duplicate email check failed: ${e.message}`);
  }

  // 5. Test Password Confirmation Validation
  try {
    const mismatchRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Mismatch User",
        email: `other_${timestamp}@example.com`,
        password: "Password123!",
        confirmPassword: "DifferentPassword123!",
      }),
    });
    assert(mismatchRes.status === 400, "5. Password confirmation mismatch rejected with 400 Bad Request");
  } catch (e) {
    assert(false, `5. Password confirmation check failed: ${e.message}`);
  }

  // 6. Test Reader /api/auth/me
  try {
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: readerCookie },
    });
    const meData = await meRes.json();
    assert(
      meRes.ok && meData.authenticated && meData.user.email === testEmail && meData.user.role === "READER",
      "6. Reader session verification (/api/auth/me) returns authenticated reader profile"
    );
  } catch (e) {
    assert(false, `6. Session verification failed: ${e.message}`);
  }

  // 7. Test Bookmark Valid Published Article
  try {
    const bmRes = await fetch(`${BASE_URL}/api/bookmarks`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: readerCookie },
      body: JSON.stringify({ articleSlug: "first-post" }),
    });
    const bmData = await bmRes.json();
    assert(bmRes.status === 201 && bmData.bookmarked === true, "7. Bookmark creation succeeds for valid article slug");
  } catch (e) {
    assert(false, `7. Bookmark creation failed: ${e.message}`);
  }

  // 8. Test Bookmark Check API
  try {
    const checkRes = await fetch(`${BASE_URL}/api/bookmarks/check?slug=first-post`, {
      headers: { Cookie: readerCookie },
    });
    const checkData = await checkRes.json();
    assert(checkRes.ok && checkData.bookmarked === true, "8. Bookmark check returns bookmarked: true for saved article");
  } catch (e) {
    assert(false, `8. Bookmark check failed: ${e.message}`);
  }

  // 9. Test Bookmark Invalid Non-existent Slug
  try {
    const invalidBmRes = await fetch(`${BASE_URL}/api/bookmarks`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: readerCookie },
      body: JSON.stringify({ articleSlug: "non-existent-fake-article-slug-12345" }),
    });
    assert(invalidBmRes.status === 404, "9. Bookmark creation for invalid slug returns 404 Not Found");
  } catch (e) {
    assert(false, `9. Invalid bookmark check failed: ${e.message}`);
  }

  // 10. Test Duplicate Bookmark Idempotency
  try {
    const dupBmRes = await fetch(`${BASE_URL}/api/bookmarks`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: readerCookie },
      body: JSON.stringify({ articleSlug: "first-post" }),
    });
    assert(dupBmRes.status === 201, "10. Duplicate bookmark is idempotent and succeeds safely");
  } catch (e) {
    assert(false, `10. Duplicate bookmark check failed: ${e.message}`);
  }

  // 11. Test List Reader Bookmarks
  try {
    const listRes = await fetch(`${BASE_URL}/api/bookmarks`, {
      headers: { Cookie: readerCookie },
    });
    const listData = await listRes.json();
    assert(
      listRes.ok && Array.isArray(listData.bookmarks) && listData.bookmarks.some((b) => b.articleSlug === "first-post"),
      "11. GET /api/bookmarks lists reader's saved articles with populated metadata"
    );
  } catch (e) {
    assert(false, `11. Bookmark list failed: ${e.message}`);
  }

  // 12. Test Delete Bookmark
  try {
    const delRes = await fetch(`${BASE_URL}/api/bookmarks?slug=first-post`, {
      method: "DELETE",
      headers: { Cookie: readerCookie },
    });
    const delData = await delRes.json();
    assert(delRes.ok && delData.bookmarked === false, "12. DELETE /api/bookmarks removes bookmark successfully");
  } catch (e) {
    assert(false, `12. Delete bookmark failed: ${e.message}`);
  }

  // 13. Test Security: Reader Access to /api/admin is Forbidden
  try {
    const adminApiRes = await fetch(`${BASE_URL}/api/admin/articles`, {
      headers: { Cookie: readerCookie },
    });
    assert(
      adminApiRes.status === 403 || adminApiRes.status === 401,
      "13. Security: Reader cannot access /api/admin endpoints (Forbidden 403)"
    );
  } catch (e) {
    assert(false, `13. Admin API security check failed: ${e.message}`);
  }

  // 14. Test Reader Logout
  try {
    const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: { Cookie: readerCookie },
    });
    const setCookieHeader = logoutRes.headers.get("set-cookie") || "";
    assert(
      logoutRes.ok && (setCookieHeader.includes("__session=;") || setCookieHeader.includes("Expires=")),
      "14. Reader Logout successfully clears session cookie"
    );
  } catch (e) {
    assert(false, `14. Logout check failed: ${e.message}`);
  }

  console.log(`\n=== RESULTS: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) process.exit(1);
}

runTests();
