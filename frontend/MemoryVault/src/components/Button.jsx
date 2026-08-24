// import "./Auth.css";
function Button({ bgColor, text, txtcolor, bordercolor, marginbtn }) {
  return (
    <button
      type="submit"
      style={{
        backgroundColor: bgColor,
        color: txtcolor,
        padding: "15px 50px",
        fontSize: "15px",
        border: "1px solid",
        borderColor: bordercolor,
        borderRadius: "8px",
        fontWeight: 600,
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        cursor: "pointer",
        marginBottom: marginbtn,
      }}
    >
      {text}
    </button>
  );
}

export default Button;
