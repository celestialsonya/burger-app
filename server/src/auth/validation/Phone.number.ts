
export function PhoneNumber(phone: string): boolean{

    // +79120250157 || 89120250157 || bye

    if (phone[0] === "+" && phone.length === 12){
        return true
    }

    if (phone[0] === "8" && phone.length === 11){
        return true
    }

    return false
}