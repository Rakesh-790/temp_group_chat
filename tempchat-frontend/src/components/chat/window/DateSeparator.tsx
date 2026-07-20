interface DateSeparatorProps {
    label: string;
}

const DateSeparator = ({ label }: DateSeparatorProps) => {
    return (
        <div className="my-6 flex justify-center">
            <span className="rounded-lg bg-[#182229] px-3 py-1 text-xs text-[#aebac1]">
                {label}
            </span>
        </div>
    );
};

export default DateSeparator;