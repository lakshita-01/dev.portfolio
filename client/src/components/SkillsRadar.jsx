import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const techStackData = [
  {
    skills: ["C++", "JAVA", "PYTHON"],
  },
  {
    skills: ["Scikit-learn", "TensorFlow", "PyTorch", "NumPy", "Pandas", "Matplotlib", "Jupyter Notebook"],
  },
  {
    skills: ["HTML/CSS", "React", "Node/Express.js", "MY SQL", "Postgres SQL", "MongoDB"],
  },
  {
    skills: ["GIT", "GITHUB", "POSTMAN", "VS CODE", "STREAMLIT"],
  },
  {
    skills: ["LINUX", "DOCKER", "VERCEL", "NETLIFY", "NOTION", "Google Cloud Console"],
  }
];

const getSkillIcon = (name, isInvert = false, size = 'default') => {
  const sizeClass = size === 'large' ? 'w-12 h-12 md:w-20 md:h-20' : 'w-10 h-10 md:w-16 md:h-16';
  const iconMap = {
    "C++": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    "JAVA": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    "PYTHON": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    "React": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    "Node/Express.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    "MongoDB": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    "Postgres SQL": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    "MY SQL": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    "GIT": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    "GITHUB": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    "HTML/CSS": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    "Scikit-learn": "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/scikitlearn.svg",
    "TensorFlow": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
    "NumPy": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
    "Pandas": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
    "PyTorch": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
    "Matplotlib": "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/matplotlib.svg",
    "VS CODE": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
    "POSTMAN": "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/postman.svg",
    "STREAMLIT": "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/streamlit.svg",
    "LINUX": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
    "DOCKER": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    "VERCEL": "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/vercel.svg",
    "NETLIFY": "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/netlify.svg",
    "NOTION": "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/notion.svg",
    "Feature Engineering": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
    "CNNs": "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/opencv.svg",
    "Natural Language Processing": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    "Google Cloud Console": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
    "Jupyter Notebook": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg"
  };

  const shouldInvert = iconMap[name] && iconMap[name].includes("simple-icons") || isInvert;

  const src = iconMap[name] || "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/codesandbox.svg";

  return (
    <img
      src={src}
      alt={name}
      className={`${sizeClass} object-contain transition-all duration-300 ${shouldInvert ? 'invert brightness-200' : 'brightness-110 hover:scale-110'}`}
      onError={(e) => {
        e.target.src = "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/codeforces.svg";
      }}
    />
  );
};

const allSkills = techStackData.flatMap(category => category.skills);

const chunkArray = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

const rows = chunkArray(allSkills, Math.ceil(allSkills.length / 3));

const MarqueeRow = ({ items, direction = "left", speed = 40 }) => {
  return (
    <div
      className="flex overflow-hidden w-full"
      style={{
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 95%, transparent)',
        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
      }}
    >
      <motion.div
        className="flex whitespace-nowrap gap-4 py-2"
        animate={{
          x: direction === "left" ? [0, -1000] : [-1000, 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        {[...items, ...items, ...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-black/20 to-black/40 border border-white/5 rounded-xl hover:border-white/20 transition-all duration-300 group cursor-pointer shadow-sm"
          >
            <div className="flex items-center justify-center w-6 h-6 opacity-80 group-hover:opacity-100 transition-opacity">
              {getSkillIcon(item)}
            </div>
            <span className="text-white/60 text-xs font-medium group-hover:text-white transition-colors uppercase tracking-tight">
              {item}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const SkillsRadar = () => {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleButtonClick = () => {
    setIsRevealed(true);
  };

  const ref = useRef(null);

  return (
    <section id="skills" className="relative py-24 overflow-hidden bg-black rounded-[3rem] border border-white/10">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: `linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Decorative Blur */}
      <div className="absolute -top-48 -left-48 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2
            className="text-4xl md:text-6xl font-bold tracking-tight leading-tight max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-white/95">Passionate about </span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent italic font-serif">
              cutting-edge
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              technologies
            </span>
          </motion.h2>
        </div>

        {/* Marquee and Video Side by Side */}
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-between mb-48">
          {/* Marquee Rows (Left) */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4 overflow-hidden mask-fade-vertical">
            {techStackData.slice(0, 5).map((category, i) => (
              <MarqueeRow
                key={i}
                items={category.skills}
                direction={i % 2 === 0 ? "left" : "right"}
                speed={30 + i * 5}
              />
            ))}
            {techStackData.slice(5).map((category, i) => (
              <MarqueeRow
                key={i + 5}
                items={category.skills}
                direction={i % 2 === 0 ? "right" : "left"}
                speed={35 + i * 5}
              />
            ))}
          </div>

          {/* Hero Video (Right) */}
          <motion.div
            className="w-full lg:w-1/2 aspect-video rounded-3xl overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-2xl relative group"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <video
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/videos/hero-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </div>

        {/* Secret Sauce Section */}
        <div ref={ref} className="text-center mt-32 relative">
          {!isRevealed ? (
            <motion.button
              onClick={handleButtonClick}
              className="relative px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ cursor: 'pointer' }}
            >
              Click to see my Secret Sauce
            </motion.button>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.3, rotate: -15 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, type: "spring", stiffness: 80, damping: 12 }}
              >
                <span className="text-sm font-bold tracking-[0.4em] text-white/40 uppercase mb-6 block">
                  TECH STACK EXPOSURE
                </span>
                <h2 className="text-4xl md:text-6xl font-serif mb-16">
                  <span className="text-white/90">The Secret </span>
                  <span className="italic bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent drop-shadow-sm">
                    Sauce
                  </span>
                </h2>
              </motion.div>

              <div className="flex flex-col gap-6 items-center max-w-6xl mx-auto px-4 pb-12">
                {rows.map((row, rowIndex) => (
                  <motion.div
                    key={rowIndex}
                    className="flex flex-wrap justify-center gap-12 md:gap-16"
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: rowIndex * 0.15, type: "spring", stiffness: 100 }}
                  >
                    {row.map((skill, skillIndex) => {
                      const randomX = (Math.random() - 0.5) * 300;
                      const randomY = (Math.random() - 0.5) * 300;
                      return (
                        <motion.div
                          key={skillIndex}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            x: [0, randomX, 0],
                            y: [0, randomY, 0]
                          }}
                          transition={{
                            duration: 2.0,
                            delay: rowIndex * 0.15 + skillIndex * 0.05,
                            type: "spring",
                            stiffness: 120,
                            damping: 15,
                            times: [0, 0.3, 1]
                          }}
                          whileHover={{
                            scale: 1.1,
                            y: -8,
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            borderColor: 'rgba(255,255,255,0.3)'
                          }}
                          className="w-8 h-8 md:w-12 md:h-12 bg-[#0F0F0F] border border-white/10 rounded-[2rem] flex items-center justify-center cursor-pointer transition-all duration-500 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                            {getSkillIcon(skill, false, 'large')}
                          </div>
                          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-white text-black text-[11px] font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 pointer-events-none translate-y-2 group-hover:translate-y-0 shadow-xl">
                            {skill}
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default SkillsRadar;
