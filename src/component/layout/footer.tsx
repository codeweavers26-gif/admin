export default function Footer() {
  return (
    <footer
      style={{
        height: "30px",
        background: "#b3aec7ff",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
      }}
    >
      © {new Date().getFullYear()} Admin Panel
    </footer>
  );
}
