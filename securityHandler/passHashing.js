import bcrypt from 'bcrypt';

export const passHashing = async(password)=>{
    try {
        const saltRounds = 8;
        const hashed = await bcrypt.hash(password , saltRounds)
        return hashed
    } catch (error) {
        console.log(error);
    }
};

export const convPassNormal = async(password ,hashed)=>{
    return bcrypt.compare(password,hashed)
};