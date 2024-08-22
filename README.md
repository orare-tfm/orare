<div id="top"></div>
<!--
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
![Product Name Screen Shot][product-screenshot]
-->


<!-- PROJECT LOGO -->
<br />
<div align="center">
<h1 align="center">Oraré</h1>

  <p align="center">
    <br />
    <a href="https://github.com/orare-tfm/orare-app" ><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://orare-8766287cc8ed.herokuapp.com/" target="_blank">View Demo</a>
    ·
    <a href="https://github.com/orare-tfm/orare-app/issues">Report Bug</a>
    ·
    <a href="https://github.com/orare-tfm/orare-app/issues">Request Feature</a>
  </p>
</div>



<!-- ABOUT THE PROJECT -->
## :open_file_folder: About The Project



In the technological world we live in today, the gap between us and faith in God is growing increasingly distant. This is how Oraré was born, with the intention of bridging this gap by bringing light through the word of God directly into the palms of your hands, whenever and wherever you need it most.

This app will primarily have two functionalities:

**Bible Verse Recommender:**
A recommender of Bible verses based on the emotions/feelings conveyed by the users words. It will also take into account external factors and individual characteristics.

**Christian Event Recommender to Create/Form a Christian Community:**
By utilizing information from the community—churches, priests, catechists, and users—we can recommend various events happening in churches depending on the environment and location.



<p align="right">(<a href="#top">back to top</a>)</p>



### :rocket: Built With
Frontend
* [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [Typescript](https://www.typescriptlang.org/)
* [Tailwind](https://tailwindcss.com/)
* [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
* [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)

Backend
* [OpenAI](https://platform.openai.com/docs/overview)
* [Pinecone](https://docs.pinecone.io/reference/api/introduction)
* [Neo4j](https://neo4j.com/docs/)



<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## :white_check_mark: Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### :computer: Installation

1. Clone the repo

   ```sh
   git clone https://github.com/orare-tfm/orare-app.git
   ```

2. Install NPM packages in "orare-app" file directory and "backend" file directory

   ```sh
   npm install
   ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## :pencil: Usage

orare-app/
    ├── frontend/
    └── backend/

1. In _frontend_ folder, create an _.env.local_ file and set all Keys required.

   ```sh
   # Google Cloud // Cloud_Firestore_Orare
   GOOGLE_CLIENT_ID='your_secret_key'
   GOOGLE_CLIENT_SECRET='your_secret_key'

   # FireAuth // 
   NEXT_PUBLIC_FIREBASE_API_KEY='your_secret_key'
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN='your_secret_key'
   NEXT_PUBLIC_FIREBASE_PROJECT_ID='your_secret_key'
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET='your_secret_key'
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID='your_secret_key'
   NEXT_PUBLIC_FIREBASE_APP_ID='your_secret_key'

   # Open AI & Pinecone
   OPENAI_API_KEY='your_secret_key'
   PINECONE_API_KEY='your_secret_key'

   # Frontend URL http://localhost/ or https://orare-8766287cc8ed.herokuapp.com/
   NEXTAUTH_URL=http://localhost/
   NEXTAUTH_SECRET='your_secret_key'

   # Backend 
   NEXT_PUBLIC_API_URL=http://localhost/
   ```

3. Go to Frontend file directory and run it

   ```sh
   cd frontend
   ```
   ```sh
   npm run dev
   ```

4. In _backend_ folder, create an _.env_ file and set all Keys required.

   ```sh
   # Neo4j Vars
   NEO4J_URI='your_secret_uri_http'
   NEO4J_USER='your_secret_user'
   NEO4J_PASSWORD='your_secret_key'
   PORT=3002

   ```

4. Go to Backend file directory and run it

   ```sh
   cd backend
   ```
   ```sh
   node server.js
   ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## :dart: Roadmap

- [ ] Events recommended according to dates


See the [open issues](https://github.com/orare-tfm/orare-app/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## :recycle: Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## :lock: License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## :wave: Creators

| Rudy Huaman | Carlos Morales | Siavosh Rahimi | Hiroshi Yague |
| -------- | -------- | -------- | -------- |
| [![Perfil 1](https://github.com/paolobang.png)](https://github.com/paolobang)  | [![Perfil 2](https://github.com/carlosml23.png)](https://github.com/carlosml23) | [![Perfil 3](https://github.com/siavoshrahimi.png)](https://github.com/siavoshrahimi) | [![Perfil 4](https://github.com/hiroshiyague.png)](https://github.com/hiroshiyague) |
| [![LinkedIn][linkedin-shield]](https://www.linkedin.com/in/rudyhuaman/) | [![LinkedIn][linkedin-shield]](https://www.linkedin.com/in/carlosmoraleslascano/) | [![LinkedIn][linkedin-shield]](https://www.linkedin.com/in/siavosh-rahimi-8000a0159/) | [![LinkedIn][linkedin-shield]](https://www.linkedin.com/in/hiroshiyague/) |


<p align="right">(<a href="#top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/orare-tfm/orare-app.svg?style=for-the-badge
[contributors-url]: https://github.com/orare-tfm/orare-app/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/orare-tfm/orare-app.svg?style=for-the-badge
[forks-url]: https://github.com/orare-tfm/orare-app/network/members
[stars-shield]: https://img.shields.io/github/starsorare-tfm/orare-app.svg?style=for-the-badge
[stars-url]: https://github.com/orare-tfm/orare-app/stargazers
[issues-shield]: https://img.shields.io/github/issues/orare-tfm/orare-app.svg?style=for-the-badge
[issues-url]: https://github.com/orare-tfm/orare-app/issues
[license-shield]: https://img.shields.io/github/license/orare-tfm/orare-app.svg?style=for-the-badge
[license-url]: https://github.com/orare-tfm/orare-app/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white
[product-screenshot]: /assets/screen.png
