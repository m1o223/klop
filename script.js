// تخزين بيانات مؤقتة (مثال)
const users = JSON.parse(localStorage.getItem("users")) || [];

// تسجيل الدخول
document.getElementById("loginForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem("loggedInUser", username);
    alert("تم تسجيل الدخول بنجاح ✅");
    window.location.href = "schema.html";
  } else {
    alert("❌ اسم المستخدم أو كلمة المرور غير صحيحة");
  }
});