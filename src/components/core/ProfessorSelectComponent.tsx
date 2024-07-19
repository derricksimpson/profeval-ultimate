import { useState } from 'react';
import Downshift from 'downshift';
import type { Professor } from '~/models/Professor';

type Props = {
    schoolId: string;
    onProfessorSelected: (professor: Professor) => void;
};

const ProfessorSelectComponent = ({ schoolId, onProfessorSelected }: Props) => {
    const [suggestions, setSuggestions] = useState<Professor[]>([]);

    const handleInputChange = async (inputValue: string) => {
        // Check if at least two letters are entered
        if (inputValue.length >= 1) {
            try {
                const response = await fetch(`/api/professors-by-letter?schoolId=${schoolId}&letter=${inputValue}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSuggestions(data); // Assuming the API returns an array of results
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSuggestions([]); // Clear suggestions on error
            }
        } else {
            setSuggestions([]); // Clear suggestions if less than two letters
        }
    };

    return (
        <Downshift
            onInputValueChange={handleInputChange}
            onSelect={(selectedItem) => {
                if (selectedItem) {
                    onProfessorSelected(selectedItem);
                }
            }}
            itemToString={(item) => (item ? `${item.lName}, ${item.fName}` : '')}
        >
            {({
                getInputProps,
                getItemProps,
                isOpen,
                inputValue,
                highlightedIndex,
            }) => (
                <div>
                    <input {...getInputProps({ placeholder: 'Search...' })} />
                    {isOpen && suggestions?.length > 0 && (
                        <div>
                            {suggestions.map((item, index) => (
                                <div
                                    {...getItemProps({
                                        key: item.id,
                                        index,
                                        item,
                                        style: {
                                            backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                                            fontWeight: highlightedIndex === index ? 'bold' : 'normal',
                                        },
                                    })}
                                >
                                    {`${item.lName}, ${item.fName}`}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </Downshift>
    );
};

export default ProfessorSelectComponent;
