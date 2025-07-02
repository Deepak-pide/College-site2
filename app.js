// 👉 Replace these with YOUR project URL and anon key
const SUPABASE_URL = 'https://tnxrbfyxbatpclbkjkgk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRueHJiZnl4YmF0cGNsYmtqa2drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NTM4OTgsImV4cCI6MjA2NzAyOTg5OH0._0NPdDkAtg2fnQCJSh0pPUxIOJnUJ-P3eNoWvTRgfp8';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById('student-form');
const tableBody = document.querySelector('#students-table tbody');

// Insert student on form submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const branch = document.getElementById('branch').value;
  const year = parseInt(document.getElementById('year').value);

  const { error } = await supabase
    .from('students')
    .insert([{ name, branch, year }]);

  if (error) {
    alert('Error adding student: ' + error.message);
  } else {
    alert('Student added!');
    form.reset();
    loadStudents();
  }
});

// Load students & display in table
async function loadStudents() {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching students:', error.message);
    return;
  }

  // Clear table
  tableBody.innerHTML = '';

  data.forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.branch}</td>
      <td>${student.year}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Load students on page load
loadStudents();
