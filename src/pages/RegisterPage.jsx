import React, { useState, useEffect } from 'react'
import { registerUser } from '../utils/api';
import { useAuthContext } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useFetchDepartments } from '../utils/queries';

function RegisterPage() {
  const { setToken } = useAuthContext();
  const [departments, setDepartments] = useState([]);
  const { data, isLoading, isError } = useFetchDepartments();  // Fetch departments with custom hook
  const navigate = useNavigate();

  // Set form data with a default role_id of 1
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    student_id: '',
    department_id: 2,
    role_id: 1,  // Automatically assign role_id to 1
    contact_no: '',
    section: '',
    password: '',
    password_confirmation: ''
  });

  // Update departments when data is fetched successfully
  useEffect(() => {
    if (data && data.departments) {
      setDepartments(data.departments);
    }
  }, [data]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      setToken(response.token);
        navigate('/');
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className='h-full w-screen'>

      <form className="mt-4 w-[700px] h-[800px] rounded-xl bg-zinc-800 m-auto flex flex-col items-center">
        <div className="grid place-items-center">
          <div className="mt-3 mb-3 text-white font-bold text-[23px]">Name</div>
          <input type="text" className='text-[15px] px-3 h-[25px] w-[350px] rounded-xl'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>


        <div className="grid place-items-center">
          <div className="mt-3 mb-3 text-white font-bold text-[23px]">Student ID</div>
          <input type="text" className='text-[15px] px-3 h-[25px] w-[350px] rounded-xl'
            value={formData.student_id}
            onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
          />
        </div>

        <div className="grid place-items-center">
          <div className="mt-3 mb-3 text-white font-bold text-[23px]">Section</div>
          <input type="text" className='text-[15px] px-3 h-[25px] w-[350px] rounded-xl'
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
          />
        </div>

        <div className="grid place-items-center">
          <div className="mt-3 mb-3 text-white font-bold text-[23px]">Email</div>
          <input type="email" className='text-[15px] px-3 h-[25px] w-[350px] rounded-xl'
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      
        <div className="grid place-items-center">
          <div className="mt-3 mb-3 text-white font-bold text-[23px]">Contact</div>
          <input type="number" className='text-[15px] px-3 h-[25px] w-[350px] rounded-xl'
            value={formData.contact_no}
            onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
          />
        </div>

        <div className="grid place-items-center">
          <div className="mt-3 mb-3 text-white font-bold text-[23px]">Department</div>
          <select className='text-[15px] px-3 h-[25px] w-[350px] rounded-xl'
            value={formData.department_id}
            onChange={(e) => setFormData({ ...formData, department_id: parseInt(e.target.value, 10) })}>
            <option value="">Select Department</option>
            {departments.map(department => (
              <option key={department.id} value={department.id}>{department.name}</option>
            ))}
          </select>
        </div>

        <div className="grid place-items-center">
          <div className="mt-3 mb-3 text-white font-bold text-[23px]">Password</div>
          <input type="password" className='text-[15px] px-3 h-[25px] w-[350px] rounded-xl'
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <div className="grid place-items-center">
          <div className="mt-3 mb-3 text-white font-bold text-[23px]">Confirm Password</div>
          <input type="password" className='text-[22px] px-3 h-[25px] w-[350px] rounded-xl'
            value={formData.password_confirmation}
            onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
          />
        </div>

        <button className="mt-6 h-[60px] w-64 rounded-xl bg-green-500 hover:bg-green-600 hover:scale-125"
          onClick={handleRegister}>
          REGISTER
        </button>
      </form>
    </div>
  )
}

export default RegisterPage;
