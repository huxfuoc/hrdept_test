import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../css/Users.scss';
import Upload from '../assets/user-image.png';
import * as XLSX from 'xlsx';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    role: yup.string().required('Role is required'),
    phone: yup.string().required('Phone number is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
});

const Users = () => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    const [users, setUsers] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [editedUser, setEditedUser] = useState({
        id: '',
        email: '',
        role: '',
        phone: '',
        firstName: '',
        lastName: '',
        profilePicture: ''
    });
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        axios.get('https://6694159dc6be000fa07e18e4.mockapi.io/api/v1/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Đã xảy ra lỗi khi tải danh sách người dùng!', error);
            });
    }, []);

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
        setCurrentPage(1); // Thiết lập lại trang đầu tiên khi tìm kiếm
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(1); // Thiết lập lại trang đầu tiên khi thay đổi số hàng trên mỗi trang
    };

    const filteredUsers = users.filter(user => {
        const matchesRole = selectedRole ? user.role === selectedRole : true;
        const matchesSearch = searchTerm ?
            user.firstName.toLowerCase().includes(searchTerm) ||
            user.lastName.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.phone.includes(searchTerm)
            : true;
        return matchesRole && matchesSearch;
    });

    const indexOfLastUser = currentPage * rowsPerPage;
    const indexOfFirstUser = indexOfLastUser - rowsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    };

    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setUserToDelete(null);
        setShowDeleteModal(false);
    };

    const deleteUser = () => {
        if (userToDelete) {
            axios.delete(`https://6694159dc6be000fa07e18e4.mockapi.io/api/v1/users/${userToDelete.id}`)
                .then(response => {
                    setUsers(users.filter(user => user.id !== userToDelete.id));
                    closeDeleteModal();
                })
                .catch(error => {
                    console.error('Đã xảy ra lỗi khi xóa người dùng!', error);
                });
        }
    };

    const openAddModal = () => {
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
        setNewUser({
            email: '',
            role: '',
            phone: '',
            firstName: '',
            lastName: '',
            profilePicture: ''
        });
        setImage(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const addUser = (data) => {
        const newUser = {
            ...data,
            profilePicture: image
        };

        axios.post('https://6694159dc6be000fa07e18e4.mockapi.io/api/v1/users', newUser)
            .then(response => {
                setUsers([...users, response.data]);
                closeAddModal();
            })
            .catch(error => {
                console.error('Đã xảy ra lỗi khi thêm người dùng!', error);
            });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        };
        setIsDragging(false);
    };

    const handleBrowserClick = () => {
        fileInputRef.current.click();
    };

    const handleRemoveImage = () => {
        setImage(null);
        fileInputRef.current.value = '';
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(users); // Tạo worksheet từ dữ liệu users
        const workbook = XLSX.utils.book_new(); // Tạo workbook mới
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users'); // Thêm worksheet vào workbook với tên là Users
        XLSX.writeFile(workbook, 'users.xlsx'); // Lưu workbook vào file users.xlsx và tải xuống
    };

    const openEditModal = (user) => {
        setShowEditModal(true);
        setEditedUser(user);
        // Set form values using setValue from react-hook-form
        setValue('email', user.email);
        setValue('role', user.role);
        setValue('phone', user.phone);
        setValue('firstName', user.firstName);
        setValue('lastName', user.lastName);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditedUser({
            id: '',
            email: '',
            role: '',
            phone: '',
            firstName: '',
            lastName: '',
            profilePicture: ''
        });
        // Reset form values using setValue from react-hook-form
        setValue('email', '');
        setValue('role', '');
        setValue('phone', '');
        setValue('firstName', '');
        setValue('lastName', '');
    };
    const editUser = (data) => {
        const updatedUser = {
            id: editedUser.id,
            ...data,
            profilePicture: image || editedUser.profilePicture
        };

        axios.put(`https://6694159dc6be000fa07e18e4.mockapi.io/api/v1/users/${editedUser.id}`, updatedUser)
            .then(response => {
                const updatedUsers = users.map(user => (
                    user.id === editedUser.id ? { ...updatedUser } : user
                ));
                setUsers(updatedUsers);
                closeEditModal();
            })
            .catch(error => {
                console.error('Đã xảy ra lỗi khi cập nhật người dùng!', error);
            });
    };

    return (
        <div className="users-container">
            <div className="users-header">
                <h5>Users</h5>
                <div className="users-actions">
                    <button className="export-btn" onClick={exportToExcel}>Export to Excel</button>
                    <button className="add-btn" onClick={openAddModal}>Add New User</button>
                </div>
            </div>
            <div className="users-filter">
                <input
                    type="text"
                    placeholder="Search by username, first name, last name, email, or phone number ..."
                    className="search-input"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <select className="role-select" value={selectedRole} onChange={handleRoleChange}>
                    <option value="">Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                    <option value="Editor">Editor</option>
                </select>
                <button className="search-btn">Search</button>
            </div>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user, index) => (
                        <tr key={user.id}>
                            <td>{indexOfFirstUser + index + 1}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.role}</td>
                            <td>
                                <button className="edit-btn" onClick={() => openEditModal(user)}>Edit</button>
                                <button className="delete-btn" onClick={() => openDeleteModal(user)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showDeleteModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Confirm Delete</h4>
                        <p>Are you sure you want to delete user {userToDelete.firstName} {userToDelete.lastName}?</p>
                        <div className="modal-actions">
                            <button className="confirm-btn" onClick={deleteUser}>Yes</button>
                            <button className="cancel-btn" onClick={closeDeleteModal}>No</button>
                        </div>
                    </div>
                </div>
            )}
            {showAddModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Add new user</h4>
                        <form onSubmit={handleSubmit(addUser)}>
                            <div className="user-details">
                                <div className='user-form'>
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        {...register('email')}
                                    />
                                    {errors.email && <p className="error-message">{errors.email.message}</p>}

                                    <label>Role</label>
                                    <select
                                        {...register('role')}
                                    >
                                        <option value="">Select</option>
                                        <option value="Admin">Admin</option>
                                        <option value="User">User</option>
                                        <option value="Editor">Editor</option>
                                    </select>
                                    {errors.role && <p className="error-message">{errors.role.message}</p>}

                                    <label>Phone number</label>
                                    <input
                                        type="text"
                                        {...register('phone')}
                                    />
                                    {errors.phone && <p className="error-message">{errors.phone.message}</p>}

                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        {...register('firstName')}
                                    />
                                    {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}

                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        {...register('lastName')}
                                    />
                                    {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
                                </div>
                                <div className='profile-picture'>
                                    <label htmlFor='picture-input'>
                                        <label>Profile Picture</label>
                                        <input type='file' className='picture-input' accept='image/*' onChange={handleFileChange} ref={fileInputRef} hidden></input>
                                        <div id='img-view' onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} style={{
                                            border: isDragging ? '2px dashed #1470e9' : '2px dashed #ccc',
                                            transition: 'border-color 0.2s ease'
                                        }}>
                                            {image ? (
                                                <div className='img-container'>
                                                    <img
                                                        src={image}
                                                        alt='Uploaded Preview'
                                                        className='preview-img'
                                                        style={{ height: '70px', width: '70px', filter: 'drop-shadow(0 8px 5px black)' }}
                                                    />
                                                    <button onClick={handleRemoveImage} className='remove-button'>X</button>
                                                </div>
                                            ) : (
                                                <div className='drop-area'>
                                                    <img
                                                        src={Upload}
                                                        alt='Upload Icon'
                                                        className='upload-img'
                                                        style={{ height: '70px', width: '70px' }}
                                                    />
                                                    <p>
                                                        Drag and Drop
                                                        <br />
                                                        or
                                                        <br />
                                                        <span role='button' onClick={handleBrowserClick} style={{ cursor: 'pointer', color: '#2B4C59' }}>Browser</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button className="confirm-btn" type="submit">Add User</button>
                                <button className="cancel-btn" onClick={closeAddModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showEditModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Edit user</h4>
                        <form onSubmit={handleSubmit(editUser)}>
                            <div className="user-details">
                                <div className='user-form'>
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        {...register('email')}
                                        defaultValue={editedUser.email}
                                    />
                                    {errors.email && <p className="error-message">{errors.email.message}</p>}

                                    <label>Role</label>
                                    <select
                                        {...register('role')}
                                        defaultValue={editedUser.role}
                                    >
                                        <option value="">Select</option>
                                        <option value="Admin">Admin</option>
                                        <option value="User">User</option>
                                        <option value="Editor">Editor</option>
                                    </select>
                                    {errors.role && <p className="error-message">{errors.role.message}</p>}

                                    <label>Phone number</label>
                                    <input
                                        type="text"
                                        {...register('phone')}
                                        defaultValue={editedUser.phone}
                                    />
                                    {errors.phone && <p className="error-message">{errors.phone.message}</p>}

                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        {...register('firstName')}
                                        defaultValue={editedUser.firstName}
                                    />
                                    {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}

                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        {...register('lastName')}
                                        defaultValue={editedUser.lastName}
                                    />
                                    {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
                                </div>
                                <div className='profile-picture'>
                                    <label htmlFor='picture-input'>
                                        <label>Profile Picture</label>
                                        <input type='file' className='picture-input' accept='image/*' onChange={handleFileChange} ref={fileInputRef} hidden></input>
                                        <div id='img-view' onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} style={{
                                            border: isDragging ? '2px dashed #1470e9' : '2px dashed #ccc',
                                            transition: 'border-color 0.2s ease'
                                        }}>
                                            {image ? (
                                                <div className='img-container'>
                                                    <img
                                                        src={image}
                                                        alt='Uploaded Preview'
                                                        className='preview-img'
                                                        style={{ height: '70px', width: '70px', filter: 'drop-shadow(0 8px 5px black)' }}
                                                    />
                                                    <button onClick={handleRemoveImage} className='remove-button'>X</button>
                                                </div>
                                            ) : (
                                                <div className='drop-area'>
                                                    <img
                                                        src={Upload}
                                                        alt='Upload Icon'
                                                        className='upload-img'
                                                        style={{ height: '70px', width: '70px' }}
                                                    />
                                                    <p>
                                                        Drag and Drop
                                                        <br />
                                                        or
                                                        <br />
                                                        <span role='button' onClick={handleBrowserClick} style={{ cursor: 'pointer', color: '#2B4C59' }}>Browser</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button className="confirm-btn" type="submit">Save Changes</button>
                                <button className="cancel-btn" onClick={closeEditModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="pagination">
                <div className="rows-per-page">
                    <span>Rows per page</span>
                    <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                    </select>
                </div>
                <div className="pagination-info">
                    <span>{indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length}</span>
                </div>
                <div className="pagination-controls">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>&lt;</button>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>&gt;</button>
                </div>
            </div>
        </div>
    );
};

export default Users;
