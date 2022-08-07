import {AuthService} from "../auth.service.ts";
import {AuthRepository} from "../auth.repository.ts";
import {jest} from "@jest/globals";

describe("register", () => {

    let authRepository;
    let authService;

    beforeEach(() => {
        authRepository = new AuthRepository(null)
        authService = new AuthService(authRepository)
    })

    it("should to create new user and return id", async () => {

        jest.spyOn(authRepository, "getByNumber").mockImplementation(() => null)
        jest.spyOn(authRepository, "register").mockImplementation(() => 1)

        const id = await authService.register({username: "Sonya", phone_number: "+79120250157"})

        expect(authRepository.getByNumber).toBeCalledTimes(1)
        expect(id).toEqual(1)

    })

})