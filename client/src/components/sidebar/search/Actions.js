import { toast } from 'react-toastify';

export const filterUsers = (allUsers, search) => {
    return allUsers.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase())
    );
};

export const handleSearchUser = (user, setSearch, navigate, onClose) => {
    if (user) {
        setSearch("");
        navigate(`/${user.username}`);
        onClose();
    } else {
        toast.error("Error");
    }
};
