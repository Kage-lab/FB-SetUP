export const Select = ({ value, onValueChange, children }) => <select value={value} onChange={e => onValueChange(e.target.value)}>{children}</select>;
export const SelectTrigger = ({ children, className }) => <div className={className}>{children}</div>;
export const SelectContent = ({ children }) => <div>{children}</div>;
export const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;