import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const AIGeneratorPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(10);
  const [tone, setTone] = useState('calm');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedScript, setEditedScript] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  
  // Example meditation script for demo purposes
  const exampleScript = `
Take a deep breath in... and slowly exhale.

Feel your body becoming more relaxed with each breath. Allow your shoulders to drop, releasing any tension you might be holding.

As you continue to breathe deeply, imagine yourself in a peaceful garden. The air is fresh and clean, filled with the gentle scent of flowers.

Notice the colors around you - vibrant greens of the grass and trees, the colorful blooms of flowers swaying gently in the breeze.

With each breath, you sink deeper into a state of calm awareness. Your mind becomes quieter, more focused on this present moment.

Allow any thoughts that arise to simply float away like clouds in the sky. There's nothing you need to do right now except be present in this moment.

Feel a sense of peace washing over you, starting from the top of your head and flowing down through your entire body to the tips of your toes.

You are safe. You are calm. You are present.

Continue to breathe deeply, enjoying this moment of tranquility...
  `;
  
  const handleGenerate = async () => {
    if (!prompt) {
      alert('Please enter a prompt for your meditation');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // In a real app, this would call an API to generate the script using AI
      // For demo purposes, we'll just simulate a delay and return a sample script
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setGeneratedScript(exampleScript);
      setEditedScript(exampleScript);
      setIsEditing(true);
    } catch (error) {
      console.error('Error generating script:', error);
      alert('Failed to generate meditation script. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSaveEdit = () => {
    setGeneratedScript(editedScript);
    setIsEditing(false);
  };
  
  const handleConvertToAudio = async () => {
    setIsConverting(true);
    
    try {
      // In a real app, this would call a TTS API to convert the script to audio
      // For demo purposes, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would be the URL to the generated audio file
      setAudioUrl('https://example.com/meditation-audio.mp3');
    } catch (error) {
      console.error('Error converting to audio:', error);
      alert('Failed to convert script to audio. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };
  
  return (
    <>
      <Header isLoggedIn={!!user} />
      <main className="pt-24 pb-32 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 gradient-text">AI Meditation Generator</h1>
            <p className="text-gray-300 mb-8">
              Create a personalized meditation script using AI. Simply enter a prompt describing the type of meditation you want, and our AI will generate a custom script for you.
            </p>
            
            <div className="bg-card rounded-xl p-8 mb-8">
              <h2 className="text-xl font-semibold mb-4">Create Your Meditation</h2>
              
              <div className="mb-6">
                <label htmlFor="prompt" className="block text-gray-300 mb-2">What kind of meditation would you like?</label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A 10-minute meditation for stress relief focused on breathing and body awareness"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-32"
                  disabled={isGenerating || generatedScript}
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="duration" className="block text-gray-300 mb-2">Duration (minutes)</label>
                  <select
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    disabled={isGenerating || generatedScript}
                  >
                    <option value="5">5 minutes</option>
                    <option value="10">10 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="20">20 minutes</option>
                    <option value="30">30 minutes</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="tone" className="block text-gray-300 mb-2">Tone</label>
                  <select
                    id="tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    disabled={isGenerating || generatedScript}
                  >
                    <option value="calm">Calm & Soothing</option>
                    <option value="energizing">Energizing</option>
                    <option value="focused">Focused & Clear</option>
                    <option value="spiritual">Spiritual</option>
                    <option value="sleep">Sleep & Relaxation</option>
                  </select>
                </div>
              </div>
              
              {!generatedScript && (
                <button
                  onClick={handleGenerate}
                  className="gradient-button w-full"
                  disabled={isGenerating || !prompt}
                >
                  {isGenerating ? 'Generating...' : 'Generate Meditation Script'}
                </button>
              )}
              
              {generatedScript && !isEditing && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Generated Meditation Script</h3>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-primary hover:text-primary-dark"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white whitespace-pre-line">
                    {generatedScript}
                  </div>
                </div>
              )}
              
              {isEditing && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Edit Your Meditation Script</h3>
                  <textarea
                    value={editedScript}
                    onChange={(e) => setEditedScript(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-64"
                  ></textarea>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
              
              {generatedScript && !isEditing && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Convert to Audio</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="voice" className="block text-gray-300 mb-2">Voice</label>
                      <select
                        id="voice"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                        disabled={isConverting || audioUrl}
                      >
                        <option value="female1">Emma (Female)</option>
                        <option value="male1">James (Male)</option>
                        <option value="female2">Sophia (Female)</option>
                        <option value="male2">Michael (Male)</option>
                        <option value="neutral">Alex (Neutral)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="background" className="block text-gray-300 mb-2">Background Sound</label>
                      <select
                        id="background"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                        disabled={isConverting || audioUrl}
                      >
                        <option value="none">None</option>
                        <option value="nature">Nature Ambience</option>
                        <option value="rain">Gentle Rain</option>
                        <option value="ocean">Ocean Waves</option>
                        <option value="forest">Forest Sounds</option>
                        <option value="binaural">Binaural Beats</option>
                      </select>
                    </div>
                  </div>
                  
                  {!audioUrl && (
                    <button
                      onClick={handleConvertToAudio}
                      className="gradient-button w-full"
                      disabled={isConverting}
                    >
                      {isConverting ? 'Converting...' : 'Convert to Audio'}
                    </button>
                  )}
                  
                  {audioUrl && (
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Your Meditation is Ready</h4>
                      <audio controls className="w-full mb-4">
                        <source src={audioUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                      <div className="flex flex-wrap gap-2">
                        <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg">
                          Save to Library
                        </button>
                        <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
                          Download
                        </button>
                        <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
                          Share
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="bg-card rounded-xl p-8">
              <h2 className="text-xl font-semibold mb-4">Tips for Great Meditation Prompts</h2>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Be specific about the purpose of your meditation (e.g., stress relief, focus, sleep)</li>
                <li>Mention any specific techniques you'd like to include (e.g., body scan, visualization)</li>
                <li>Specify the tone or style you prefer (e.g., gentle guidance, minimal instruction)</li>
                <li>Include any themes or imagery you'd like to incorporate (e.g., nature, light, water)</li>
                <li>Mention if you're a beginner or experienced with meditation</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AIGeneratorPage;
