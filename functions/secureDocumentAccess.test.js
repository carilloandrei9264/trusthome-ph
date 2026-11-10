const test = require("node:test");
const assert = require("node:assert/strict");
const { canReadSecureDocument } = require("./secureDocumentAccess");

test("active owners can access documents under their verification path", () => {
  assert.equal(
    canReadSecureDocument("owner-1", { status: "active", role: "user" }, "verification/owner-1/listing-1/id.pdf"),
    true,
  );
});

test("suspended owners and admins cannot access verification documents", () => {
  assert.equal(
    canReadSecureDocument("owner-1", { status: "suspended", role: "user" }, "verification/owner-1/listing-1/id.pdf"),
    false,
  );
  assert.equal(
    canReadSecureDocument("admin-1", { status: "suspended", role: "admin" }, "verification/owner-1/listing-1/id.pdf"),
    false,
  );
});

test("only active admins can access another user's verification documents", () => {
  assert.equal(
    canReadSecureDocument("admin-1", { status: "active", role: "admin" }, "verification/owner-1/listing-1/id.pdf"),
    true,
  );
  assert.equal(
    canReadSecureDocument("user-1", { status: "active", role: "user" }, "verification/owner-1/listing-1/id.pdf"),
    false,
  );
});

test("secure document access rejects non-verification and malformed paths", () => {
  const owner = { status: "active", role: "user" };
  assert.equal(canReadSecureDocument("owner-1", owner, "other/owner-1/listing-1/id.pdf"), false);
  assert.equal(canReadSecureDocument("owner-1", owner, "verification/owner-1/listing-1"), false);
  assert.equal(canReadSecureDocument("owner-1", owner, "verification/owner-1/listing-1/id.pdf/extra"), false);
  assert.equal(canReadSecureDocument("owner-1", owner, "verification//listing-1/id.pdf"), false);
});
