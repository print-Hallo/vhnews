export function validateAdminToken(request) {
  const token = request.headers.get("x-admin-token") || request.cookies.get("admin-token")?.value

  return token === process.env.ADMIN_PASSWORD
}

export function createAuthResponse(success, message = "") {
  return Response.json({ success, message }, { status: success ? 200 : 401 })
}
