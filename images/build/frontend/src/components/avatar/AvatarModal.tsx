import React, { useState } from 'react';
import './AvatarModal.css';
import api from '../../api';

interface AvatarModalProps {
    show: boolean;
    onClose: () => void;
    onSelect: (avatar: string) => void;
}

export default function AvatarModal({ show, onClose, onSelect }: AvatarModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    if (!show) {
        return null;
    }
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };
    // const changeAvatar = async (avatar: string) => {
    //     try {
    //         const res = await api.put("/api/user/change-Avatar", { avatar });
    //         if (res.status >= 200 && res.status < 300) {
    //             onSelect(avatar);
    //         } else {
    //             console.error("Failed to change avatar", res);
    //         }
    //     }
    //     catch (error) {
    //         console.error("Failed to change avatar", error);
    //         if (error.response) {
    //             console.error("Response data:", error.response.data);
    //             console.error("Response status:", error.response.status);
    //             console.error("Response headers:", error.response.headers);
    //         }
    //     }
    // }
    const changeAvatar = async () => {
        if (!selectedFile) {
            console.error("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append('avatar', selectedFile);

        try {
            const res = await api.put("/api/user/change-Avatar", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.status >= 200 && res.status < 300) {
                onSelect(URL.createObjectURL(selectedFile));
            } else {
                console.error("Failed to change avatar", res);
            }
        } catch (error) {
            console.error("Failed to change avatar", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
            }
        }
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Choose your avatar</h2>
                <input type="file" onChange={handleFileChange} accept="image/*" />
                <button onClick={changeAvatar} disabled={!selectedFile}>
                    Upload Avatar
                </button>
            </div>
        </div>
    );
}