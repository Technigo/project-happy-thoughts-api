const handleErrors = (res, error, status = 500, message = 'Internal Server Error') => {
    console.error(error);
    res.status(status).json({ message });
};

export default handleErrors;