import React from 'react';
import { VCardData } from '../types';
import { BriefcaseIcon, LinkIcon, MailIcon, MapPinIcon, PhoneIcon, UserIcon, UploadIcon, TrashIcon } from './icons';

interface CardFormProps {
  cardData: VCardData;
  setCardData: React.Dispatch<React.SetStateAction<VCardData>>;
}

interface InputFieldProps {
  id: keyof VCardData;
  label: string;
  value: string;
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, value, icon, placeholder, type = 'text', onChange }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {icon}
        </div>
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="block w-full rounded-md border-0 bg-white py-2.5 pl-10 text-slate-800 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-brand-purple sm:text-sm"
        />
      </div>
    </div>
);

const processImage = (file: File, callback: (dataUrl: string) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIMENSION = 96; // Heavily compress for QR Code
        let { width, height } = img;

        if (width > height) {
          if (width > MAX_DIMENSION) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // Lower quality for smaller size
        callback(dataUrl);
      };
    };
    reader.readAsDataURL(file);
};


const CardForm: React.FC<CardFormProps> = ({ cardData, setCardData }) => {
  const photoFileInputRef = React.useRef<HTMLInputElement>(null);
  const logoFileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'photo' | 'companyLogo') => {
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0], (dataUrl) => {
        setCardData(prev => ({ ...prev, [field]: dataUrl }));
      });
    }
  };

  const handleRemoveImage = (field: 'photo' | 'companyLogo') => {
    setCardData(prev => ({ ...prev, [field]: '' }));
    const ref = field === 'photo' ? photoFileInputRef : logoFileInputRef;
    if (ref.current) {
      ref.current.value = '';
    }
  };


  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Card Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-6">
        {/* Photo Upload */}
        <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-slate-300">
            {cardData.photo ? (
                <img src={cardData.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <UserIcon className="w-10 h-10 text-slate-400" />
            )}
            </div>
            <div className="flex flex-col gap-2">
                <input type="file" ref={photoFileInputRef} onChange={(e) => handleFileChange(e, 'photo')} accept="image/*" className="hidden" id="photo-upload"/>
                <label htmlFor="photo-upload" className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-slate-700 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors">
                    <UploadIcon className="h-4 w-4" /> Upload
                </label>
                {cardData.photo && (
                    <button onClick={() => handleRemoveImage('photo')} type="button" className="inline-flex items-center gap-2 rounded-md bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-200 transition-colors">
                        <TrashIcon className="h-4 w-4" /> Remove
                    </button>
                )}
            </div>
        </div>
        {/* Logo Upload */}
        <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-slate-300 p-1">
            {cardData.companyLogo ? (
                <img src={cardData.companyLogo} alt="Company Logo" className="w-full h-full object-contain" />
            ) : (
                <BriefcaseIcon className="w-10 h-10 text-slate-400" />
            )}
            </div>
            <div className="flex flex-col gap-2">
                <input type="file" ref={logoFileInputRef} onChange={(e) => handleFileChange(e, 'companyLogo')} accept="image/*" className="hidden" id="logo-upload"/>
                <label htmlFor="logo-upload" className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-slate-700 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors">
                    <UploadIcon className="h-4 w-4" /> Upload
                </label>
                {cardData.companyLogo && (
                    <button onClick={() => handleRemoveImage('companyLogo')} type="button" className="inline-flex items-center gap-2 rounded-md bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-200 transition-colors">
                        <TrashIcon className="h-4 w-4" /> Remove
                    </button>
                )}
            </div>
        </div>
      </div>
      <p className="text-xs text-slate-500 -mt-4 mb-6">Images are heavily compressed to fit in the QR code. For best results, use simple, square-cropped photos.</p>


      <form className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField id="firstName" label="First Name" value={cardData.firstName} onChange={handleChange} placeholder="" icon={<UserIcon className="h-5 w-5 text-slate-400" />}/>
            <InputField id="lastName" label="Last Name" value={cardData.lastName} onChange={handleChange} placeholder="" icon={<UserIcon className="h-5 w-5 text-slate-400" />}/>
        </div>
        <InputField id="title" label="Title / Position" value={cardData.title} onChange={handleChange} placeholder="" icon={<BriefcaseIcon className="h-5 w-5 text-slate-400" />}/>
        <InputField id="company" label="Company" value={cardData.company} onChange={handleChange} placeholder="" icon={<BriefcaseIcon className="h-5 w-5 text-slate-400" />}/>
        <InputField id="phone" label="Phone" type="tel" value={cardData.phone} onChange={handleChange} placeholder="" icon={<PhoneIcon className="h-5 w-5 text-slate-400" />}/>
        <InputField id="email" label="Email" type="email" value={cardData.email} onChange={handleChange} placeholder="" icon={<MailIcon className="h-5 w-5 text-slate-400" />}/>
        <InputField id="website" label="Website" type="url" value={cardData.website} onChange={handleChange} placeholder="" icon={<LinkIcon className="h-5 w-5 text-slate-400" />}/>
        <InputField id="address" label="Address" value={cardData.address} onChange={handleChange} placeholder="" icon={<MapPinIcon className="h-5 w-5 text-slate-400" />}/>
      </form>
    </div>
  );
};

export default CardForm;