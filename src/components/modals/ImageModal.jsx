import { X } from '../icons/Icons';
import { images } from '../../config/images';

export const ImageModal = ({ show, onClose, currentPageData }) => {
  if (!show) return null;

  const getImageSrc = () => {
    if (currentPageData.id === 'group-practice') return images.groupPracticeApp;
    if (currentPageData.id === 'question-6') return images.question6;
    if (currentPageData.id === 'payto-mailto') return images.paytoMailto;
    if (currentPageData.id === 'questions-9-17') return images.contactInfo;
    if (currentPageData.id === 'email-to-snow') return images.emailField;
    if (currentPageData.id === 'question-20') return images.practitioners;
    if (currentPageData.id === 'existing-provider-questions-21-23') return images.questions21to24;
    if (currentPageData.displayImage) return currentPageData.displayImage;
    return images.questions21to24;
  };

  const getImageAlt = () => {
    if (currentPageData.id === 'group-practice') return 'Group Practice Application Example';
    if (currentPageData.id === 'question-6') return 'Question 6 Example';
    if (currentPageData.id === 'payto-mailto') return 'Pay To / Mail To Address Example';
    if (currentPageData.id === 'questions-9-17') return 'Contact Information Example';
    if (currentPageData.id === 'email-to-snow') return 'Email Field Example';
    if (currentPageData.id === 'question-20') return 'Practitioners Example';
    if (currentPageData.id === 'existing-provider-questions-21-23') return 'Questions 21-24 Example';
    return 'Example Image';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <span>Close</span>
          <X className="w-6 h-6" />
        </button>
        <img
          src={getImageSrc()}
          alt={getImageAlt()}
          className="modal-image"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};
