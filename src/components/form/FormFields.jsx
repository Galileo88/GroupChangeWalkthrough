import { CheckCircle2, Circle } from '../icons/Icons';

// Text Input Field
export const TextField = ({ field, value, onChange, formData }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        {typeof field.label === 'function' ? field.label(formData) : field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder={field.placeholder}
        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-slate-800"
        required={field.required}
      />
      {field.helperNotes && (
        <div className="mt-3 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
          <ul className="space-y-2">
            {field.helperNotes.map((note, i) => (
              <li key={i} className="text-sm text-slate-700 flex gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Radio Button Field
export const RadioField = ({ field, value, onChange, formData }) => {
  const options = typeof field.options === 'function' ? field.options(formData) : field.options;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        {typeof field.label === 'function' ? field.label(formData) : field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option}
            className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
              value === option
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-300 hover:border-indigo-300 bg-white'
            }`}
          >
            <input
              type="radio"
              value={option}
              checked={value === option}
              onChange={(e) => onChange(field.name, e.target.value)}
              className="w-4 h-4 text-indigo-600"
              required={field.required}
            />
            <span className={`font-medium ${value === option ? 'text-indigo-700' : 'text-slate-700'}`}>
              {option}
            </span>
          </label>
        ))}
      </div>
      {field.helperNotes && (
        <div className="mt-3 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
          <ul className="space-y-2">
            {field.helperNotes.map((note, i) => (
              <li key={i} className="text-sm text-slate-700 flex gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Checkbox Field
export const CheckboxField = ({ field, value, onChange, formData, unableToVerifyFields, onUnableToVerify }) => {
  const isUnableToVerify = unableToVerifyFields.has(field.name);

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3 p-4 border-2 border-slate-300 rounded-lg bg-white">
        <div className="flex items-center gap-3 flex-1">
          {value ? (
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
          ) : isUnableToVerify ? (
            <Circle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
          ) : (
            <Circle className="w-6 h-6 text-slate-400 flex-shrink-0" />
          )}
          <label className="text-sm font-medium text-slate-700 flex-1 cursor-pointer">
            {typeof field.label === 'function' ? field.label(formData) : field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange(field.name, true)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              value
                ? 'bg-green-600 text-white'
                : 'bg-slate-200 text-slate-600 hover:bg-green-100 hover:text-green-700'
            }`}
          >
            ✓
          </button>
          {onUnableToVerify && (
            <button
              type="button"
              onClick={() => onUnableToVerify(field)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                isUnableToVerify
                  ? 'bg-yellow-600 text-white'
                  : 'bg-slate-200 text-slate-600 hover:bg-yellow-100 hover:text-yellow-700'
              }`}
            >
              Unable to Verify
            </button>
          )}
        </div>
      </div>
      {field.sovosUrl && (
        <a
          href={field.sovosUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-sm text-indigo-600 hover:text-indigo-700 underline"
        >
          → Open SOVOS
        </a>
      )}
      {field.npiRegistryUrl && (
        <a
          href={field.npiRegistryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-sm text-indigo-600 hover:text-indigo-700 underline"
        >
          → Open NPI Registry
        </a>
      )}
      {field.helperNotes && (
        <div className="mt-3 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
          <ul className="space-y-2">
            {field.helperNotes.map((note, i) => (
              <li key={i} className="text-sm text-slate-700 flex gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Field Renderer - determines which field component to use
export const renderField = (field, formData, handleFieldChange, unableToVerifyFields, handleUnableToVerify) => {
  const value = formData[field.name];

  switch (field.type) {
    case 'text':
      return <TextField field={field} value={value} onChange={handleFieldChange} formData={formData} />;
    case 'radio':
      return <RadioField field={field} value={value} onChange={handleFieldChange} formData={formData} />;
    case 'checkbox':
      return (
        <CheckboxField
          field={field}
          value={value}
          onChange={handleFieldChange}
          formData={formData}
          unableToVerifyFields={unableToVerifyFields}
          onUnableToVerify={handleUnableToVerify}
        />
      );
    default:
      return null;
  }
};
