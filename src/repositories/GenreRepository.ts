export class Genre {
    id: number;
    name: string;
}

class GenreRepository {
    private genres: Genre[] = [
        {id: 1, name: 'Science fiction'},
        {id: 2, name: 'Western'},
        {id: 3, name: 'Horror'},
        {id: 4, name: 'Romance'},
        {id: 5, name: 'Detective'},
    ];

    public getGenres() {
        return [...this.genres];
    }

    public getGenre(id: number) {
        return this.genres.find(genre => genre.id === id);
    }
}

let repository = new GenreRepository();
export default repository;