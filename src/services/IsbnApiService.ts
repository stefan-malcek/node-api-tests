import axios from 'axios';

export class IsbnApiService {
    // Should be in config.
    private readonly baseUrl = 'https://api.altmetric.com/v1/isbn';

    public async getBookInfo(isbn: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/${isbn}`);
            return response.data;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}