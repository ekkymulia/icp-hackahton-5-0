import {
    blob,
    Canister,
    ic,
    Err,
    nat64,
    Ok,
    Opt,
    Principal,
    query,
    Record,
    Result,
    StableBTreeMap,
    text,
    update,
    Variant,
    Vec
} from 'azle';

const User = Record({
    id: Principal,
    fullName: text, // Corrected to `text` instead of `Text`
    dateOfBirth: text,
    nationality: text,
    gender: text,
    address: text,
    governmentId: text,
    phoneNumber: text,
    email: text,
    photo: text,
    sourceOfFunds: text,
    bankAccountInfo: text,
    taxIdentificationNumber: text,
    recordingIds: Vec(Principal), // Added missing field to match the usage
    createdAt: nat64 // Added missing field to match the usage
});
type User = typeof User.tsType;

const Recording = Record({
    id: Principal,
    audio: blob,
    createdAt: nat64,
    name: text,
    userId: Principal
});
type Recording = typeof Recording.tsType;

const AudioRecorderError = Variant({
    UserDoesNotExist: Principal,
    RecordingDoesNotExist: Principal
});

let users = StableBTreeMap<Principal, User>(0);

export default Canister({
    createUser: update([text], User, (fullName) => { 
        const id = generateId();
        const user: User = {
            id,
            fullName,
            dateOfBirth: "",
            nationality: "",
            gender: "",
            address: "",
            governmentId: "",
            phoneNumber: "",
            email: "",
            photo: "",
            sourceOfFunds: "",
            bankAccountInfo: "",
            taxIdentificationNumber: "",
            recordingIds: [],
            createdAt: ic.time()
        };

        users.insert(user.id, user);

        return user;
    }),
    readUsers: query([], Vec(User), () => {
        return users.values();
    }),
    readUserById: query([Principal], Opt(User), (id) => {
        return users.get(id);
    }),
    deleteUser: update([Principal], Result(User, AudioRecorderError), (id) => {
        const userOpt = users.get(id);

        if ('None' in userOpt) {
            return Err({
                UserDoesNotExist: id
            });
        }

        const user = userOpt.Some;

        users.remove(user.id);

        return Ok(user);
    })
});

function generateId(): Principal {
    const randomBytes = new Array(29)
        .fill(0)
        .map(() => Math.floor(Math.random() * 256));

    return Principal.fromUint8Array(Uint8Array.from(randomBytes));
}
