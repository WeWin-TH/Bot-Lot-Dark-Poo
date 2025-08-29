const form = document.getElementById('regForm');
const statusBox = document.getElementById('status');
const photoInput = document.getElementById('photo');
const previewContainer = document.getElementById('photoPreviewContainer');

// Preview QR code image
photoInput.addEventListener('change', () => {
  previewContainer.innerHTML = '';
  const file = photoInput.files[0];
  if (file) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    previewContainer.appendChild(img);
  }
});

// Handle form submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusBox.innerHTML = '';
  statusBox.style.display = "block";
  statusBox.textContent = "⏳ กำลังส่งข้อมูล...";

  const fd = new FormData(form);

  // รวม sectors เป็น string
  const sectors = [];
  form.querySelectorAll('input[name="sectors"]:checked').forEach(el => sectors.push(el.value));
  fd.delete('sectors');
  fd.append('sectors', sectors.join(', '));

  try {
    const resp = await fetch('https://wewin-backend.onrender.com/api/register', {
      method: 'POST',
      body: fd
    });

    const data = await resp.json().catch(() => ({}));

    if (data && data.ok) {
      statusBox.className = 'success';
      statusBox.textContent = data.message || '✅ ส่งสำเร็จ';
      form.reset();
      previewContainer.innerHTML = '';
    } else {
      statusBox.className = 'error';
      statusBox.textContent = (data && data.error) ? data.error : '❌ เกิดข้อผิดพลาด';
    }
  } catch (err) {
    statusBox.className = 'error';
    statusBox.textContent = '❌ ไม่สามารถเชื่อมต่อ Server ได้';
  }

  // ซ่อน status อัตโนมัติ
  setTimeout(() => statusBox.style.display = "none", 3000);
}, false);

// Reset form handler
form.addEventListener("reset", () => {
  setTimeout(() => {
    statusBox.className = "reset";
    statusBox.style.display = "block";
    statusBox.textContent = "พร้อมเริ่มกรอกใหม่ 🚀";
    previewContainer.innerHTML = '';
    setTimeout(() => statusBox.style.display = "none", 2000);
  }, 200);
});
