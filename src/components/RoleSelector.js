function RoleSelector({ role, setRole }) {

  return (
    <>
      <h2>Select Role</h2>

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="admin">Admin</option>
        <option value="staff">Staff</option>
      </select>

      <br /><br />
    </>
  );
}

export default RoleSelector;