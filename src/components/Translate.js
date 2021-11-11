import React, { useState, useEffect } from 'react';
import {
    Form,
    TextArea,
    Button,
    Icon
} from 'semantic-ui-react';
import axios from 'axios';

export default function Translate() {
    const [inputText, setInputText] = useState('');
    const [resultText, setResultText] = useState('');
    const [selectedLanguageKey, setLanguageKey] = useState('')
    const [languagesList, setLanguagesList] = useState([])
    const [detectLanguageKey, setdetectedLanguageKey] = useState('')
    const getLanguageSource = () => {
        axios.post(`https://libretranslate.de/detect`, {
            q: inputText
        })
        .then((response) => {
            setdetectedLanguageKey(response.data[0].language)
        })
    }
    const translateText = () => {
        setResultText(inputText)

        getLanguageSource();

        let data = {
            q : inputText,
            source: detectLanguageKey,
            target: selectedLanguageKey
        }
        axios.post(`https://libretranslate.de/translate`, data)
        .then((response) => {
            setResultText(response.data.translatedText)
        })
    }

    const languageKey = (selectedLanguage) => {
        setLanguageKey(selectedLanguage.target.value)
    }

    useEffect(() => {
       axios.get(`https://libretranslate.de/languages`)
       .then((response) => {
        setLanguagesList(response.data)
       })

       getLanguageSource()
    }, [inputText])
    return (
        <div className="body-app">
            <div className="app-header">
                <h2 className="header">EZ-Translate</h2>
            </div>

            <div className='app-body'>
                <div>
                    
                    <Form>
                    <div className='form__group'>
                        <Form.Field
                            control={TextArea}
                            placeholder='Type Some Text To Translate.'
                            onChange={(e) => setInputText(e.target.value)}
                        />
                    </div>

                        <select className="language-select" onChange={languageKey}>
                            <option>Please Select Language.</option>
                            {languagesList.map((language) => {
                                return (
                                    <option value={language.code}>
                                        {language.name}
                                    </option>
                                )
                            })}
                        </select>

                        <Form.Field
                            control={TextArea}
                            placeholder='Your Resulting Translation..'
                            value={resultText}
                        />

                        <Button 
                            color="#fff" 
                            size="large" 
                            onClick={translateText}
                        >
                            <Icon name='translate' />
                            Translate</Button>
                    </Form>
                </div>
            </div>
        </div>
    )
}
