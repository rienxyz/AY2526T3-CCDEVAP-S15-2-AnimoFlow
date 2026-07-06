export class Profile {
    constructor(image, name, email, occupation) {
        this.image = image;
        this.name = name;
        this.email = email;
        this.occupation = occupation;
    }
}

export class Report {
    constructor(reporter, building, elevator, queue_length) {
        this.reporter = reporter;
        this.building = building;
        this.elevator = elevator;
        this.queue_length = queue_length;
    }
}

// Use case
// import { User } from "./models/User";

// const user = new User(
//     "1",
//     "Alice",
//     "alice@gmail.com",
//     25
// );
