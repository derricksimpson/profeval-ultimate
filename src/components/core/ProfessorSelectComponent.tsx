import { useState, useRef } from 'react';
import Downshift from 'downshift';
import type { Professor } from '~/models/Professor';
import type { CSSProperties } from 'react';

type Props = {
    schoolId: string;
    onProfessorSelected: (professor: Professor) => void;
};

const ProfessorSelectComponent = ({ schoolId, onProfessorSelected }: Props) => {
    const [suggestions, setSuggestions] = useState<Professor[]>([]);
    const cache = useRef<{ [letter: string]: Professor[] }>({});

    const handleInputChange = async (inputValue: string) => {
        if (inputValue.length >= 1) {
            const firstLetter = inputValue[0].toLowerCase();

            // Check if the first letter is cached
            if (cache.current[firstLetter]) {
                // Filter cached results based on the input value
                const filteredSuggestions = cache.current[firstLetter].filter(professor =>
                    professor.lName.toLowerCase().startsWith(inputValue.toLowerCase())
                );
                setSuggestions(filteredSuggestions);
            } else {
                try {
                    const response = await fetch(`/api/professors-by-letter?schoolId=${schoolId}&letter=${firstLetter}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    cache.current[firstLetter] = data; // Cache the results

                    // Filter the results based on the input value
                    const filteredSuggestions = data.filter(professor =>
                        professor.lName.toLowerCase().startsWith(inputValue.toLowerCase())
                    );
                    setSuggestions(filteredSuggestions);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                    setSuggestions([]); // Clear suggestions on error
                }
            }
        } else {
            setSuggestions([]); // Clear suggestions if less than one letter
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
                <div style={{ position: 'relative' }}>
                    <input {...getInputProps({ placeholder: 'Search...' })} />
                    {isOpen && suggestions?.length > 0 && (
                        <div style={dropdownStyles as CSSProperties}>
                            {suggestions.map((item, index) => (
                                <div
                                    {...getItemProps({
                                        key: item.id,
                                        index,
                                        item,
                                        style: {
                                            ...itemStyles,
                                            backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                                            fontWeight: highlightedIndex === index ? 'bold' : 'normal',
                                        } as CSSProperties,
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

const dropdownStyles: CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: '200px',
    overflowY: 'auto',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    zIndex: 1,
};

const itemStyles: CSSProperties = {
    padding: '8px 16px',
    cursor: 'pointer',
};

export default ProfessorSelectComponent;
