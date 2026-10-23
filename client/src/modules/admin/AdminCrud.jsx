import { useEffect, useState } from 'react';
import http, { errMsg, uploadImage } from '../../api/http.js';

/*
  config = {
    title, listUrl, saveUrl,
    columns: [{ key, label, render?(row) }],
    fields:  [{ name, label, type: text|textarea|number|checkbox|select|image|datetime|lines, options?, createOnly? }],
    defaults: {}
  }
*/
export default function AdminCrud({ config, header = null, reloadKey = 0 }) {
  const { title, listUrl, saveUrl, columns, fields, defaults = {} } = config;
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState(null);   // null = closed, {} = new, {_id} = editing
  const [err, setErr] = useState('');

  const load = () => http.get(listUrl).then((r) => setRows(r.data));
  useEffect(() => { load(); }, [listUrl, reloadKey]);

  const save = async (e) => {
    e.preventDefault(); setErr('');
    try {
      form._id ? await http.put(`${saveUrl}/${form._id}`, form) : await http.post(saveUrl, form);
      setForm(null); load();
    } catch (e) { setErr(errMsg(e)); }
  };
  const remove = async (row) => { if (confirm('Delete this item?')) { await http.delete(`${saveUrl}/${row._id}`); load(); } };
  const set = (name, v) => setForm((f) => ({ ...f, [name]: v }));
  const toInput = (d) => (d ? new Date(d).toISOString().slice(0, 16) : '');

  const shown = rows.filter((r) => JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));

  const renderField = (f) => {
    const v = form[f.name];
    switch (f.type) {
      case 'textarea': return <textarea rows="4" value={v || ''} onChange={(e) => set(f.name, e.target.value)} />;
      case 'number': return <input type="number" value={v ?? ''} onChange={(e) => set(f.name, Number(e.target.value))} />;
      case 'checkbox': return <input type="checkbox" checked={!!v} onChange={(e) => set(f.name, e.target.checked)} />;
      case 'select': return <select value={v ?? ''} onChange={(e) => set(f.name, isNaN(f.options[0].value) ? e.target.value : Number(e.target.value))}>
        {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>;
      case 'datetime': return <input type="datetime-local" value={toInput(v)} onChange={(e) => set(f.name, e.target.value)} />;
      case 'lines': return <textarea rows="3" placeholder="One per line" value={(v || []).join('\n')} onChange={(e) => set(f.name, e.target.value.split('\n'))} />;
      case 'image': return (
        <div>
          {v && <img src={v} alt="" className="thumb" />}
          <input type="file" accept="image/*" onChange={async (e) => e.target.files[0] && set(f.name, await uploadImage(e.target.files[0]))} />
        </div>);
      default: return <input value={v || ''} onChange={(e) => set(f.name, e.target.value)} />;
    }
  };

  return (
    <div>
      <div className="admin-head">
        <h1>{title}</h1>
        <input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn btn-primary" onClick={() => setForm({ ...defaults })}>+ Add</button>
      </div>

      {header}
      <table className="table">
        <thead><tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}<th /></tr></thead>
        <tbody>
          {shown.map((row) => (
            <tr key={row._id}>
              {columns.map((c) => <td key={c.key}>{c.render ? c.render(row) : String(row[c.key] ?? '')}</td>)}
              <td className="actions">
                <button onClick={() => setForm(row)}>Edit</button>
                <button onClick={() => remove(row)}>Delete</button>
                {config.rowActions?.map((a) => <button key={a.label} onClick={async () => { await a.run(row, rows, load); load(); }}>{a.label}</button>)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {form && (
        <div className="modal"><form className="modal-box form" onSubmit={save}>
          <h2>{form._id ? 'Edit' : 'Add'} {title}</h2>
          {fields.filter((f) => !(f.createOnly && form._id)).map((f) => (
            <label key={f.name}><span>{f.label}</span>{renderField(f)}</label>
          ))}
          {err && <p className="error">{err}</p>}
          <div className="btn-row"><button className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-outline" onClick={() => setForm(null)}>Cancel</button></div>
        </form></div>
      )}
    </div>
  );
}
