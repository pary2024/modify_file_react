import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../colors/Thems";
import {
  Send,
  MessageSquare,
  User,
  Smartphone,
  X,
  Loader2,
  Info,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createSms, fetchSmsList } from "../stores/smsSlice";
import { fetchPatients } from "../stores/patientSlice";

const Sms = () => {
  const { isDark } = useContext(ThemeContext);
  const { patients } = useSelector((state) => state.patient);
  const { messages } = useSelector((state) => state.sms);
  const dispatch = useDispatch();

  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);
  const [showTips, setShowTips] = useState(true);
  const [manualPhone, setManualPhone] = useState("");
  const [patientSend , setPatientSend] = useState("");
  const [phoneSend , setPhoneSend] = useState("");
  const [noteSend , setNoteSend] = useState("");

  const maxSmsLength = 160;

  useEffect(() => {
    dispatch(fetchSmsList());
    dispatch(fetchPatients());
  }, [dispatch]);
  console.log(messages);

  const phoneNumbers = patients.map((p) => p.phone);



 const handleSend = async(e)=>{
  e.preventDefault();

  const data ={
    patient_id: patientSend,
    phone: phoneSend,
    note: noteSend

  }
  try{
    setIsSending(true);
    await dispatch(createSms(data));
    setIsSending(false);


  }catch(e){
    console.log(e);
  }
 }

  const handleManualPhoneChange = (e) => {
    const value = e.target.value;
    setManualPhone(value);
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  // const getCharacterCountColor = () => {
  //   const count = formData.content.length;
  //   if (count > maxSmsLength * 2) return "text-red-500";
  //   if (count > maxSmsLength) return "text-yellow-500";
  //   return isDark ? "text-gray-400" : "text-gray-600";
  // };

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <MessageSquare size={24} /> Send SMS
        </h1>

        {sendStatus && (
          <div
            className={`mb-4 p-3 rounded-lg flex items-center ${
              sendStatus.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            } ${
              isDark
                ? sendStatus.type === "success"
                  ? "bg-green-900 text-green-100"
                  : "bg-red-900 text-red-100"
                : ""
            }`}
          >
            {sendStatus.icon}
            <span>{sendStatus.message}</span>
            <button
              onClick={() => setSendStatus(null)}
              className="ml-auto p-1 rounded-full hover:bg-opacity-20 hover:bg-black"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <form onSubmit={ handleSend}>
          <div className="grid gap-4 mb-6">
            {/* Patient Selection */}
            <div className="grid gap-2">
              <label className="flex items-center gap-2">
                <User size={18} /> Patient
              </label>
              <select
                name="patient_id"
                value={patientSend}
                onChange={(e)=> setPatientSend(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:border-blue-500"
                } focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
              >
                <option value="">-- Select Patient --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}{" "}
                    {p.phones?.find((ph) => ph.isPrimary)?.number
                      ? `(${p.phones.find((ph) => ph.isPrimary).number})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone Number Section */}
            <div className="grid gap-2">
              <label className="flex items-center gap-2">
                <Smartphone size={18} /> Phone Number
              </label>

              <select
              name="phone"
              value={phoneSend}
              onChange={(e)=> setPhoneSend(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-black"
                } focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
              >
                <option value="">Select a phone number</option>
                {phoneNumbers.map((number, index) => (
                  <option key={index} value={number}>
                    {number}
                  </option>
                ))}
              </select>
            </div>

            {/* Message Content */}
            <div className="grid gap-2">
              <label className="flex items-center gap-2">
                <MessageSquare size={18} /> Message
              </label>
              <textarea
                name="note"
                rows="6"
                value={noteSend}
                onChange={(e)=> setNoteSend(e.target.value)}
                required
                className={`w-full p-3 rounded-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:border-blue-500"
                } focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                placeholder="Type your message here..."
              ></textarea>
              {/* <div className={`text-sm ${getCharacterCountColor()}`}>
                {formData.content.length} characters (
                {Math.ceil(formData.content.length / maxSmsLength)} SMS)
              </div> */}
            </div>

            {/* Note Field */}
           
          </div>

          {/* Send Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSending}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                isSending
                  ? isDark
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isSending ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} /> Send SMS
                </>
              )}
            </button>
          </div>
        </form>

        {/* Tips Section */}
        {showTips && (
          <div
            className={`mt-8 p-4 rounded-lg ${
              isDark ? "bg-gray-800" : "bg-blue-50"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium flex items-center gap-2">
                <Info size={18} /> SMS Tips
              </h3>
              <button
                onClick={() => setShowTips(false)}
                className="p-1 rounded-full hover:bg-opacity-20 hover:bg-black"
              >
                <X size={18} />
              </button>
            </div>
            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>Standard SMS messages are limited to 160 characters</li>
              <li>
                Messages longer than 160 characters will be split and charged
                accordingly
              </li>
              <li>Double-check phone numbers before sending</li>
              <li>Avoid sending sensitive information via SMS</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sms;
