"use client";
import {useEffect, useRef, useState} from "react";
import HanziWriter from "hanzi-writer";

export default function useHanziWrite(character, options = {}) {
    const containerRef = useRef(null);
    const writerRef = useRef(null);
    const autoPlayRef = useRef(true);

    const [isLoading, setIsLoading] = useState(true);
    const [mode, setMode] = useState('demo');

    const startDemo = () => {
        if (!writerRef.current) return;
        setMode('demo');
        writerRef.current.animateCharacter({
            onComplete: () => {
                if (autoPlayRef.current) {
                    setTimeout(() => {
                        if (autoPlayRef.current && writerRef.current) {
                            startDemo();
                        }
                    }, 1000);
                }
            }
        });
    };

    useEffect(() => {
        if (writerRef.current) {
            writerRef.current = null;
        }
        
        if (!containerRef.current) return;
        setIsLoading(true);

        // Nettoyer le contenu du conteneur
        while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
        }

        const defaultOptions = {
            width: 300,
            height: 300,
            padding: 5,
            strokeAnimationSpeed: 1.5,
            drawingWidth: 12,
            strokeWidth: 8,
            strokeCapStyle: 'round',
            strokeJoinStyle: 'round',
            delayBetweenStrokes: 500,
            strokeColor: '#FFFFFF',
            outlineColor: '#DF6060',
            drawingColor: '#FFFFFF',
            showCharacter: false,
            showOutline: true,
            drawingWidth: 50,
        };

        const mergedOptions = { ...defaultOptions, ...options };
        
        try {
            console.log("Creating HanziWriter with character:", character);
            const writer = HanziWriter.create(containerRef.current, character, mergedOptions);
            writerRef.current = writer;
            setIsLoading(false);

            setTimeout(() => {
                if (writerRef.current) {
                    startDemo();
                }
            }, 300);
        } catch (error) {
            console.error("Error initializing HanziWriter:", error);
            setIsLoading(false);
        }

        return () => {
            autoPlayRef.current = false;
            if (writerRef.current) {
                writerRef.current = null;
            }
        }
    }, [character]);

    const handlePractice = () => {
        autoPlayRef.current = false;
        if (!writerRef.current) return;
        setMode('practice');
        writerRef.current.quiz({
            showOutline: true,
            showHintAfterMisses: 1,
        });
    }

    const handleReset = () => {
        if (!writerRef.current) return;
        writerRef.current.cancelQuiz();
        writerRef.current.hideCharacter();
        autoPlayRef.current = true;
        setMode('demo');
        startDemo();
    }

    const handleManualDemo = () => {
        autoPlayRef.current = false;
        if (!writerRef.current) return;
        setMode('demo');
        writerRef.current.animateCharacter();
    }

    const stopAutoPlay = () => {
        autoPlayRef.current = false;
    }

    const startAutoPlay = () => {
        autoPlayRef.current = true;
        startDemo();
    }

    return {
        containerRef,
        isLoading,
        mode,
        handlePractice,
        handleReset,
        handleManualDemo,
        stopAutoPlay,
        startAutoPlay
    };
}