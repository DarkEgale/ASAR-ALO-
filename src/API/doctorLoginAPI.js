




export const doctorLogin = async (credentials) => {
    const response = await fetch("https://asar-alo.onrender.com/api/auth/doctors/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro Login failed");
    }

    return await response.json();
};