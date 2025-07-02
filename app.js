// ✅ 1) Replace with YOUR Supabase details:
const SUPABASE_URL = 'https://tnxrbfyxbatpclbkjkgk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRueHJiZnl4YmF0cGNsYmtqa2drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NTM4OTgsImV4cCI6MjA2NzAyOTg5OH0._0NPdDkAtg2fnQCJSh0pPUxIOJnUJ-P3eNoWvTRgfp8';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById('student-form');
const tableBody = document.querySelector('#students-table tbody');

// ✅ 2) Add student to Supabase when form is submitted
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const branch = document.getElementById('branch').value;
  const year = parseInt(document.getElementById('year').value);

  if (!name) {
    alert('Name is required');
    return;
  }

  const { error } = await supabase.from('students').insert([
    { name, branch, year }
  ]);

  if (error) {
    alert('Error: ' + error.message);
  } else {
    form.reset();
  }
});

// ✅ 3) Fetch students and display them
async function loadStudents() {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  tableBody.innerHTML = ''; // Clear old rows

  data.forEach(({ name, branch, year }) => {
    const row = `<tr>
      <td>${name}</td>
      <td>${branch}</td>
      <td>${year}</td>
    </tr>`;
    tableBody.innerHTML += row;
  });
}

// ✅ 4) Listen for Realtime changes — auto reload when anyone adds/updates/deletes
supabase
  .channel('students_changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, loadStudents)
  .subscribe();

// ✅ 5) Load on page open
loadStudents();
