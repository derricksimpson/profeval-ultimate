type ChipProps = {
    label: string;
    color?: string;
    textColor?: string;
}

import { BsEmojiSmile } from 'react-icons/bs';
import { BsEmojiNeutral } from 'react-icons/bs';
import { BsEmojiFrown } from 'react-icons/bs';

const Chip = ({ label, color, textColor }: ChipProps) => {

    if (!color) {
        color = "bg-gray-200";
    }

    if (!textColor) {
        textColor = "text-gray-800";
    }

    return (<div className={`center mr-2 inline-block select-none whitespace-nowrap rounded-full ${color} ${textColor} px-3.5 py-1.5 alignbaseline font-sans text-xs font-bold uppercase leading-none`} >
        <p className="block font-sans text-sm font-medium capitalize leading-none antialiased">
            {label}
        </p>
    </div >);
};

export default Chip;