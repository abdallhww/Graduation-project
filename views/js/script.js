// الانتقال بين النموذجين (Sign In و Sign Up)
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
  
    // عند النقر على زر "Sign Up"
    registerBtn.addEventListener('click', () => {
      container.classList.add('active');
    });
  
    // عند النقر على زر "Sign In"
    loginBtn.addEventListener('click', () => {
      container.classList.remove('active');
    });
  
    // جمع بيانات النموذج (Sign Up)
    const signUpForm = document.querySelector('.sign-up form');
    signUpForm.addEventListener('submit', (e) => {
      e.preventDefault(); // منع إعادة تحميل الصفحة
  
      // جمع البيانات المدخلة
      const name = signUpForm.querySelector('input[type="text"]').value;
      const email = signUpForm.querySelector('input[type="email"]').value;
      const password = signUpForm.querySelector('input[type="password"]').value;
  
      // عرض البيانات في الكونسول (يمكنك إرسالها إلى الخادم لاحقًا)
      console.log('Sign Up Data:', { name, email, password });
  
      // إظهار رسالة نجاح
      alert('تم تسجيل الحساب بنجاح!');
    });
  
    // جمع بيانات النموذج (Sign In)
    const signInForm = document.querySelector('.sign-in form');
    signInForm.addEventListener('submit', (e) => {
      e.preventDefault(); // منع إعادة تحميل الصفحة
  
      // جمع البيانات المدخلة
      const email = signInForm.querySelector('input[type="email"]').value;
      const password = signInForm.querySelector('input[type="password"]').value;
  
      // عرض البيانات في الكونسول (يمكنك إرسالها إلى الخادم لاحقًا)
      console.log('Sign In Data:', { email, password });
  
      // إظهار رسالة نجاح
      alert('تم تسجيل الدخول بنجاح!');
    });
  });