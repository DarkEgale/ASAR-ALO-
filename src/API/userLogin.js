

export const userLogin = async (credentials) => {
    try {
        const response = await fetch("https://asar-alo.onrender.com/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error Login failed");
        
        return data;
    } catch (error) {
        throw error;
    }
};