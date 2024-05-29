// src/components/Container.js
import React, { useEffect } from 'react';
import Lock from './Lock.js';
import '../../assets/css/403.css';
import { Link } from 'react-router-dom';

const Container = () => {
    useEffect(() => {
        const interval = 500;

        const generateLocks = () => {
            const lock = document.createElement('div');
            const position = generatePosition();
            lock.innerHTML = '<div class="top"></div><div class="bottom"></div>';
            lock.style.top = position[0];
            lock.style.left = position[1];
            lock.classList.add('lock');
            document.body.appendChild(lock);
            setTimeout(() => {
                lock.style.opacity = '1';
                lock.classList.add('generated');
            }, 100);
            setTimeout(() => {
                lock.parentElement.removeChild(lock);
            }, 2000);
        };

        const generatePosition = () => {
            const x = Math.round(Math.random() * 90) + '%';
            const y = Math.round(Math.random() * 100) + '%';
            return [x, y];
        };

        const intervalId = setInterval(generateLocks, interval);
        generateLocks();

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="container-forbidden">
            <h1>
                4
                <Lock />
                3
            </h1>
            <p>Access denied</p>
            <p>Go back to Menu <Link className='text-white' to={'/admin/index'}><u>Dashboard</u></Link></p>
        </div>
    );
};

export default Container;
