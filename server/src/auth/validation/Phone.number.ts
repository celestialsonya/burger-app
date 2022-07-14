
export function PhoneNumber(phone: string): boolean{

    // +79120250157 || bye

    if (phone[0] === "+" && phone[1] === "7" && phone[2] === "9" && phone.length === 12){
        return true
    }

    return false
}