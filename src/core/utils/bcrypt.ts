import * as bcrpyt from "bcrypt"


export async function hashPassword(password: string): Promise<string> {
    try {
        return await bcrpyt.hash(password, 10)
    } catch (error: any) {
        console.log(error.message)
        throw new Error("Problem with hashing")
    }
}


export async function checkPassword(password, hashPass) {
    try {
        return await bcrpyt.compare(password, hashPass)
    } catch (error) {
        console.log(error)
    }
}