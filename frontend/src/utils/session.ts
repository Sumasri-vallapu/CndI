
  // ✅ Set
  export const setLoggedInMobile = (mobileNumber: string): void => {
    localStorage.setItem("mobile_number", mobileNumber)
  }  


// ✅ Get
export const getLoggedInMobile = (): string | null => {
    return localStorage.getItem("mobile_number")
  }
  
  
  // ✅ Clear
  export const clearLoggedInMobile = (): void => {
    localStorage.removeItem("mobile_number")
  }
  