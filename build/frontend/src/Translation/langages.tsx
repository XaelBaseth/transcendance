import React, { useState } from 'react';

interface Language {
    code: string;
    name: string;
}

const languages: Language[] = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'pt', name: 'Português' }
];

const translations: Record<string, Record<string, string>> = {
    fr: {
        hello: 'Bonjour',
        goodbye: 'Au revoir'
        // Ajoutez ici d'autres traductions pour le français
    },
    pt: {
        "Hello" : "Olá",
    "Goodbye" : "Adeus",
    "All friends" : "Todos os amigos",
    "Active friends" : "Amigos ativos",
    "Blocked user" : "Usuários bloqueados",
    "Pending resquest" : "Solicitação de amizade",
    "Leaderboard" : "Classificação",
    "Match History" : "Histórico de partidas",
    "Settings" : "Configurações",
    "Log in" : "Entrar",
    "LogOut" : "Sair",
    "Press to play" : "Jogar",
    "Enter a pseudo" : "Nome de usuário",
    "Enter a bio" : "Biografia",
    "Enter a email" : "Endereço de e-mail",
    "New password" : "Nova senha",
    "placeholder" : "Texto",
    "Change your password" : "Alterar senha",
    "Confirm the new password" : "Confirmação da nova senha",
    "show password" : "Mostrar",
    "Save password change" : "Salvar a nova senha",
    "Do you want to delete your account ?" : "Deseja excluir sua conta?",
    "Beware, this action is irreversible" : "Atenção, esta ação é irreversível",
    "Delete" : "Excluir",
    "Delete your account" : "Excluir a conta",
    "Username" : "Nome de usuário",
    "Password" : "Senha",
    "Log in with 42" : "Entrar com 42",
    "Sign Up" : "Registrar-se",
    "Change your avatar" : "Alterar avatar",
    "Choose a new file" : "Escolher um novo arquivo",
    "Upload" : "Salvar",
    "You will now be redirected to the home page in a few seconds..." : "Você será redirecionado para a página inicial em alguns segundos...",
    "Your account was successfully deleted!" : "Sua conta foi excluída com sucesso"
    }
};

const LanguageSelector: React.FC = () => {
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
    const [showOptions, setShowOptions] = useState(false);

    const handleLanguageChange = (language: Language) => {
        setSelectedLanguage(language);
        setShowOptions(false);
    };

    return (
        <div className="language-selector">
            <button className="language-button" onClick={() => setShowOptions(!showOptions)}>
                {selectedLanguage.name}
            </button>
            {showOptions && (
                <div className="language-options">
                    {languages.map((language) => (
                        <button key={language.code} onClick={() => handleLanguageChange(language)}>
                            {language.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
