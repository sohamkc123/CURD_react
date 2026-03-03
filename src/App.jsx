import { useState } from 'react'

const initialStudents = [
  { id: 1, name: 'Aarav Shah',  email: 'aarav@email.com',  age: 20, branch: 'CS', year: '2nd' },
  { id: 2, name: 'Priya Mehta', email: 'priya@email.com',  age: 21, branch: 'IT', year: '3rd' },
  { id: 3, name: 'Rohan Verma', email: 'rohan@email.com',  age: 19, branch: 'EC', year: '1st' },
  { id: 4, name: 'Sneha Joshi', email: 'sneha@email.com',  age: 22, branch: 'ME', year: '4th' },
  { id: 5, name: 'Karan Patel', email: 'karan@email.com',  age: 20, branch: 'CE', year: '2nd' },
]

const empty = { name: '', email: '', age: '', branch: '', year: '' }

function StudentForm({ onSubmit, onCancel, initial, title }) {
  const [form, setForm] = useState(initial || empty)
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.age || form.age < 1 || form.age > 60) e.age = 'Valid age required'
    if (!form.branch) e.branch = 'Select branch'
    if (!form.year) e.year = 'Select year'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSubmit(form)
    if (!initial) { setForm(empty); setErrors({}) }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label>Full Name *</label>
        <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Soham Kumar" className={errors.name ? 'err' : ''} />
        {errors.name && <span className="err-msg">{errors.name}</span>}
      </div>
      <div className="form-group">
        <label>Email *</label>
        <input name="email" value={form.email} onChange={handleChange} placeholder="student@email.com" className={errors.email ? 'err' : ''} />
        {errors.email && <span className="err-msg">{errors.email}</span>}
      </div>
      <div className="form-group">
        <label>Age *</label>
        <input type="number" name="age" value={form.age} onChange={handleChange} placeholder="Age" className={errors.age ? 'err' : ''} />
        {errors.age && <span className="err-msg">{errors.age}</span>}
      </div>
      <div className="form-group">
        <label>Branch *</label>
        <select name="branch" value={form.branch} onChange={handleChange}>
          <option value="">-- Select Branch --</option>
          <option value="CS">Computer Science (CS)</option>
          <option value="IT">Information Technology (IT)</option>
          <option value="EC">Electronics (EC)</option>
          <option value="ME">Mechanical (ME)</option>
          <option value="CE">Civil (CE)</option>
        </select>
        {errors.branch && <span className="err-msg">{errors.branch}</span>}
      </div>
      <div className="form-group">
        <label>Year *</label>
        <select name="year" value={form.year} onChange={handleChange}>
          <option value="">-- Select Year --</option>
          <option value="1st">1st Year</option>
          <option value="2nd">2nd Year</option>
          <option value="3rd">3rd Year</option>
          <option value="4th">4th Year</option>
        </select>
        {errors.year && <span className="err-msg">{errors.year}</span>}
      </div>
      <div className="btn-row">
        <button type="submit" className="btn btn-primary">{title}</button>
        {onCancel && <button type="button" className="btn btn-gray" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}

function EditModal({ student, onSave, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>X</button>
        <h2>Edit Student</h2>
        <StudentForm
          initial={student}
          title="Save Changes"
          onSubmit={data => { onSave(student.id, data); onClose() }}
          onCancel={onClose}
        />
      </div>
    </div>
  )
}

export default function App() {
  const [students, setStudents] = useState(initialStudents)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [editing, setEditing] = useState(null)

  function handleAdd(data) {
    setStudents(prev => [{ ...data, id: Date.now() }, ...prev])
  }

  function handleUpdate(id, data) {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
  }

  function handleDelete(id) {
    if (!window.confirm('Delete this student?')) return
    setStudents(prev => prev.filter(s => s.id !== id))
  }

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || s.branch === filter
    return matchSearch && matchFilter
  })

  const branches = ['All', 'CS', 'IT', 'EC', 'ME', 'CE']
  const total = students.length
  const avgAge = total ? (students.reduce((s, x) => s + Number(x.age), 0) / total).toFixed(1) : 0
  const byBranch = ['CS','IT','EC','ME','CE'].reduce((acc, b) => { acc[b] = students.filter(s => s.branch === b).length; return acc }, {})
  const topBranch = Object.entries(byBranch).sort((a,b) => b[1]-a[1])[0]?.[0] || '-'

  return (
    <>
      <div className="header">
        <div className="header-brand">Student Manager</div>
        <div className="header-author">Soham</div>
      </div>

      <div style={{ maxWidth: 1050, margin: '20px auto 0', padding: '0 20px' }}>
        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-num" style={{ color: 'var(--primary)' }}>{total}</div>
            <div className="stat-lbl">Total Students</div>
          </div>
          <div className="stat-box">
            <div className="stat-num" style={{ color: 'var(--green)' }}>{filtered.length}</div>
            <div className="stat-lbl">Showing</div>
          </div>
          <div className="stat-box">
            <div className="stat-num" style={{ color: '#d97706' }}>{avgAge}</div>
            <div className="stat-lbl">Avg Age</div>
          </div>
          <div className="stat-box">
            <div className="stat-num" style={{ color: '#7c3aed' }}>{topBranch}</div>
            <div className="stat-lbl">Top Branch</div>
          </div>
        </div>
      </div>

      <div className="layout">
        <div className="card">
          <div className="card-title">Add New Student</div>
          <StudentForm title="Add Student" onSubmit={handleAdd} />
        </div>

        <div className="card">
          <div className="card-title">Student Records</div>
          <div className="toolbar">
            <input className="search-input" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
              {branches.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Name</th><th>Email</th><th>Age</th><th>Branch</th><th>Year</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr className="empty-row"><td colSpan={7}>No students found.</td></tr>
                ) : (
                  filtered.map((s, i) => (
                    <tr key={s.id}>
                      <td style={{ color: 'var(--soft)', fontSize: '0.78rem' }}>{i + 1}</td>
                      <td style={{ fontWeight: 700 }}>{s.name}</td>
                      <td style={{ color: 'var(--soft)' }}>{s.email}</td>
                      <td>{s.age}</td>
                      <td><span className={`badge b-${s.branch.toLowerCase()}`}>{s.branch}</span></td>
                      <td>{s.year}</td>
                      <td>
                        <button className="action-btn edit-btn" onClick={() => setEditing(s)}>Edit</button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(s.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editing && (
        <EditModal student={editing} onSave={handleUpdate} onClose={() => setEditing(null)} />
      )}
    </>
  )
}
