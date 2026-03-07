document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".copy-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-copy");
      const text = document.getElementById(id).innerText;

      navigator.clipboard.writeText(text);

      this.innerText = "✓";
      setTimeout(() => {
        this.innerText = "📋";
      }, 1200);
    });
  });
});