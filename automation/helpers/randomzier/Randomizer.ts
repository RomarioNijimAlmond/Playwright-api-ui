import { faker } from '@faker-js/faker';

export default class Randomizer {

    public get getRandomFirstName(): string {
        return faker.name.firstName();
    }

    public get getRandomLastName(): string {
        return faker.name.lastName();
    }

    public get getRandomEmail(): string {
        return faker.internet.email();
    }

    public get getRandomWords(): string {
        return faker.random.words();
    }

    public get getRandomJobTitle(): string {
        return faker.name.jobTitle();
    }

    public get getRandomJobDescription(): string {
        return faker.name.jobDescriptor();
    }

    public get getRandomDepartment(): string {
        return faker.commerce.department();
    }

    public get getRandomDomainWords(): string {
        return faker.internet.domainWord();
    }

    public get getRandomNumbers(): number {
        return faker.datatype.number({ min: 600, max: 3000 });
    }

    public get getRandomLargeNumbers(): number {
        return faker.datatype.number({ min: 1, max: 5000 });
    }

    public get getPetName(): string {
        return faker.animal.dog();
    }
}
