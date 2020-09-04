declare const http: any;
declare const fs: any;
declare const AdmZip: any;
declare const bigXml: any;
declare class FidePlayerService {
    constructor(properties: any);
    /**
     * This method does a http GET request to the fide download page for a zip XML data file.
     * @return { promise }
     * @param { string } fileName
     */
    download(fileName: any): any;
    /**
     * This method takes the unzipped xml file and reads it into JSON where all other processes
     * outside of this service can just that data source.
     * @return { promise }
     * @param { string } file
     **/
    createJson(file: any): any;
    /**
     * This method takes a .zip file and unzips it to the same folder.
     * @return { promise }
     * @param { string } file
     */
    extract(file: any): any;
}
