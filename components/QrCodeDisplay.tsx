import React, { useRef, useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { VCardData } from '../types';
import { DownloadIcon, UserIcon, MailIcon, PhoneIcon, MapPinIcon, AlertTriangleIcon } from './icons';

interface QrCodeDisplayProps {
  cardData: VCardData;
}

const MAX_QR_CODE_BYTE_LENGTH = 2953; // Safe limit for QR codes (Version 40, L ECC)

// Generates a vCard string using vCard 2.1 for maximum compatibility with both Android and iOS.
const generateVCardString = (data: VCardData, includePhoto: boolean): string => {
  const vCardParts = [
    'BEGIN:VCARD',
    'VERSION:2.1',
    `N:${data.lastName};${data.firstName}`,
    `FN:${data.firstName} ${data.lastName}`,
    `TITLE:${data.title}`,
    `ORG:${data.company}`,
    `TEL;WORK;VOICE:${data.phone}`,
    `EMAIL;PREF;INTERNET:${data.email}`,
    `URL:${data.website}`,
    `ADR;WORK:;;${data.address};;;`
  ];

  // vCard 2.1 syntax for photos is more widely supported by Android scanners.
  if (includePhoto && data.photo) {
    const base64PhotoData = data.photo.substring(data.photo.indexOf(',') + 1);
    vCardParts.push(`PHOTO;ENCODING=BASE64;JPEG:${base64PhotoData}`);
  }

  // NOTE: Company Logo is still excluded to save space.
  vCardParts.push('END:VCARD');
  return vCardParts.join('\r\n');
};


const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({ cardData }) => {
  const qrRef = useRef<SVGSVGElement>(null);
  const [vCardString, setVCardString] = useState('');
  const [isPhotoOmitted, setIsPhotoOmitted] = useState(false);
  
  useEffect(() => {
    // Attempt to generate vCard with the photo
    const vCardWithPhoto = generateVCardString(cardData, true);
    
    // Check byte length to see if it fits in a QR code
    if (new TextEncoder().encode(vCardWithPhoto).length <= MAX_QR_CODE_BYTE_LENGTH) {
      setVCardString(vCardWithPhoto);
      setIsPhotoOmitted(false);
    } else {
      // If too large, generate it again without the photo and set a warning flag
      setVCardString(generateVCardString(cardData, false));
      setIsPhotoOmitted(true);
    }
  }, [cardData]);

  const handleDownload = () => {
    if (!qrRef.current) return;

    const svgElement = qrRef.current;
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 64; // add padding
      canvas.height = img.height + 64;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 32, 32);
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      const safeFilename = `${cardData.firstName}-${cardData.lastName}-qrcode.png`.toLowerCase().replace(/[^a-z0-9-]/g, '');
      downloadLink.download = safeFilename || 'qrcode.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgString)}`;
  };

  return (
    <div className="flex flex-col items-center justify-start h-full">
      <div className="w-full max-w-sm">
        <h3 className="text-lg font-semibold text-center text-slate-700 mb-4">Card Preview</h3>
        
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative aspect-[10/16] max-h-[550px]">
            <div className="absolute top-0 left-0 right-0 h-1/3">
                <svg className="w-full h-full" viewBox="0 0 320 120" preserveAspectRatio="none">
                    <path d="M0,60 C40,90 100,20 160,70 C220,120 280,30 320,80 L320,0 L0,0 Z" className="fill-brand-purple"></path>
                </svg>
            </div>

            <div className="absolute top-0 left-0 right-0 flex justify-center pt-8">
                <div className="w-24 h-24 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                    {cardData.photo ? (
                    <img src={cardData.photo} alt="Profile Preview" className="w-full h-full object-cover" />
                    ) : (
                    <UserIcon className="w-12 h-12 text-slate-400" />
                    )}
                </div>
            </div>

            <div className="relative pt-36 px-6 pb-6 flex flex-col h-full">
                <div className="text-center flex-shrink-0">
                    <h4 className="text-2xl font-bold text-slate-800">{cardData.firstName} {cardData.lastName}</h4>
                    <p className="text-md text-slate-600">{cardData.title}</p>
                    <p className="text-sm text-slate-500 mt-1">{cardData.company}</p>
                </div>
                
                <div className="flex-grow mt-4 space-y-2 text-sm text-slate-700 text-left">
                    {cardData.phone && (
                        <div className="flex items-center">
                            <PhoneIcon className="w-4 h-4 text-brand-purple mr-3 flex-shrink-0"/>
                            <a href={`tel:${cardData.phone}`} className="truncate hover:text-brand-purple">{cardData.phone}</a>
                        </div>
                    )}
                    {cardData.email && (
                        <div className="flex items-center">
                            <MailIcon className="w-4 h-4 text-brand-purple mr-3 flex-shrink-0"/>
                            <a href={`mailto:${cardData.email}`} className="truncate hover:text-brand-purple">{cardData.email}</a>
                        </div>
                    )}
                    {cardData.address && (
                        <div className="flex items-start">
                            <MapPinIcon className="w-4 h-4 text-brand-purple mr-3 flex-shrink-0 mt-0.5"/>
                            <span className="text-xs">{cardData.address}</span>
                        </div>
                    )}
                </div>
                
                <div className="pt-2 w-full flex justify-end flex-shrink-0">
                    {cardData.companyLogo && (
                        <div className="w-20 h-10">
                            <img src={cardData.companyLogo} alt="Company Logo" className="w-full h-full object-contain" />
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm p-6 mt-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center w-full max-w-sm">
        <h2 className="text-xl font-bold text-slate-800">Your QR Code</h2>
        
        {isPhotoOmitted && (
          <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 w-full rounded-r-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm">
                  Photo removed from QR code. The image file was too large, so it was excluded to ensure the QR code is scannable.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="w-[224px] h-[224px] flex items-center justify-center mt-4">
            <div className="bg-white p-3 rounded-lg shadow-md border border-slate-200">
              <QRCodeSVG
                ref={qrRef}
                value={vCardString}
                size={200}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"}
                includeMargin={false}
              />
            </div>
        </div>

        <button
          onClick={handleDownload}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-purple px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          <DownloadIcon className="h-5 w-5" />
          Download QR Code
        </button>
      </div>
    </div>
  );
};

export default QrCodeDisplay;