import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCompany, deleteCompany, fetchCompanies } from "../stores/companySlice";
import { cache } from "react";

const Company = () => {
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.company);

  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState({ id: null, name: "", image: "" });
  const [name, setName] = useState("");
  const [phone , setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address , setAddress] = useState("");

  const [image, setImage] = useState("");
  const [alertMessage , setAlertMessage] = useState(null);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);
   useEffect(() => {
      if (alertMessage) {
        Swal.fire({
          icon: alertMessage.type,
          title: alertMessage.text,
          showConfirmButton: false,
          timer: 1500,
          position: "top-end",
        });
        setAlertMessage(null); // clear after showing
      }
    }, [alertMessage]);

  const openModal = (company = { id: null, name: "", image: "" }) => {
    setCurrent(company);
    setModalOpen(true);
  };
  const handleDelete = async (id) =>{
    try{
      await dispatch(deleteCompany(id));
      dispatch(fetchCompanies());
      Swal.fire({
              icon: "success",
              title: "Company deleted successfully!",
              showConfirmButton: false,
              timer: 1500,
              position: "top-end",
            });

    }catch(e){
      Swal.fire({
              icon: "success",
              title: "Company delete wrong successfully!",
              showConfirmButton: false,
              timer: 1500,
              position: "top-end",
            });
    }
  }

  const closeModal = () => {
    setModalOpen(false);
    setCurrent({ id: null, name: "", image: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {

      name:name,
      phone:phone,
      email:email,
      address:address,
      image:image
    }
    try{
      await dispatch(createCompany(data));
      closeModal();
      dispatch(fetchCompanies());
        Swal.fire({
              icon: "success",
              title: "Company created successfully!",
              showConfirmButton: false,
              timer: 1500,
              position: "top-end",
            });

    }catch(e){
      console.log(e);
    }

    

    // do something with data
  
    closeModal();
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Companies</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead className="bg-gray-50">
          <tr className="text-left text-sm font-medium text-gray-500">
            <th className="px-6 py-3 border-b border-gray-200"> image</th>
            <th className="px-6 py-3 border-b border-gray-200"> Name</th>
            <th className="px-6 py-3 border-b border-gray-200"> phone</th>
            <th className="px-6 py-3 border-b border-gray-200"> email</th>
            <th className="px-6 py-3 border-b border-gray-200"> address</th>
            <th className="px-6 py-3 border-b border-gray-200 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.isArray(companies) &&
            companies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        src={company.image}
                        alt={company.name}
                        className="h-10 w-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = 'https://via.placeholder.com/40?text=CL';
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{company.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{company.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{company.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{company.address}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openModal(company)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(company.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="border-b px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {current.id ? "Edit Clinic Details" : "Register New Clinic"}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {current.id ? "Update clinic information" : "Fill in the clinic details below"}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter company name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company contact <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter company name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company email <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter company name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company location <span className="text-red-500">*</span>
                </label>
                <textarea rows={3}
                  type="text"
                  name="name"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter company name"
                  required
                />
              </div>
              
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Logo
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500">
                    <div className="p-4 text-center">
                      <svg className="w-8 h-8 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <p className="text-sm text-gray-500 mt-2">
                        {image ? image.name : 'Click to upload logo'}
                      </p>
                    </div>
                    <input
                      type="file"
                      name="image"
                      onChange={(e) => setImage(e.target.files[0])}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">Recommended: Square image (JPG, PNG)</p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {current.id ? "Update Clinic" : "Register Clinic"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Company;
