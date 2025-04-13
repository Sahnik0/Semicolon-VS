import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import MarketplaceExtension from "../extensions/MarketplaceExtension";
import { Extension, registerExtension } from "@/contexts/ExtensionContext";
import { toast } from "@/hooks/use-toast";

// Function to create a countdown timer element
const createTimerElement = () => {
  const timerDiv = document.createElement('div');
  timerDiv.id = 'hackathon-timer';
  timerDiv.className = 'fixed top-14 right-4 bg-background border border-border rounded-md p-2 shadow-md z-50 flex flex-col items-center';
  
  const title = document.createElement('div');
  title.className = 'font-semibold text-xs mb-1';
  title.innerText = 'Hackathon Ends In:';
  
  const timeDisplay = document.createElement('div');
  timeDisplay.className = 'text-primary font-mono text-sm';
  timeDisplay.id = 'timer-countdown';
  
  const setTime = () => {
    const endDate = new Date('2025-06-20T23:59:59');
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) {
      timeDisplay.innerText = 'Hackathon Ended!';
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    timeDisplay.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };
  
  const closeButton = document.createElement('button');
  closeButton.className = 'absolute top-1 right-1 text-xs opacity-70 hover:opacity-100';
  closeButton.innerHTML = '&times;';
  closeButton.onclick = () => timerDiv.remove();
  
  timerDiv.appendChild(title);
  timerDiv.appendChild(timeDisplay);
  timerDiv.appendChild(closeButton);
  
  setTime();
  const interval = setInterval(setTime, 1000);
  
  // Store interval ID in the element so we can clear it when removing
  timerDiv.dataset.intervalId = interval.toString();
  
  return { element: timerDiv, interval };
};

// Function to create a team collaboration panel
const createTeamPanel = () => {
  const teamPanel = document.createElement('div');
  teamPanel.id = 'team-hub-panel';
  teamPanel.className = 'fixed bottom-10 right-4 bg-background border border-border rounded-md shadow-md z-50 w-72';
  
  // Initialize team state (would typically come from an API/storage)
  const teamState = {
    members: [
      { id: 'you', name: 'You', status: 'online', isCurrentUser: true },
      { id: 'member1', name: '', status: 'offline', isCurrentUser: false },
      { id: 'member2', name: '', status: 'offline', isCurrentUser: false },
      { id: 'member3', name: '', status: 'offline', isCurrentUser: false },
    ],
    tasks: [
      { id: 'task1', text: 'Setup project repository', completed: true },
      { id: 'task2', text: 'Implement user authentication', completed: false },
      { id: 'task3', text: 'Create dashboard UI', completed: false },
      { id: 'task4', text: 'Test API endpoints', completed: false },
    ],
    messages: [
      { id: 'msg1', sender: 'system', text: 'Welcome to Team Hub! Collaborate with your team here.', time: new Date().toISOString() }
    ],
    files: [
      { id: 'file1', name: 'Project Plan.pdf', size: '2.3 MB', shared: false }
    ],
    activeTab: 'tasks' // 'tasks', 'chat', 'files'
  };
  
  // Utility function to save state to localStorage
  const saveState = () => {
    localStorage.setItem('teamHubState', JSON.stringify(teamState));
  };
  
  // Utility function to load state from localStorage
  const loadState = () => {
    const savedState = localStorage.getItem('teamHubState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        
        // Update our state with saved values
        teamState.members.forEach((member, i) => {
          if (i > 0 && i - 1 < parsed.members.length) {
            member.name = parsed.members[i - 1].name;
            member.status = parsed.members[i - 1].status;
          }
        });
        
        if (parsed.tasks) teamState.tasks = parsed.tasks;
        if (parsed.messages) teamState.messages = parsed.messages;
        if (parsed.files) teamState.files = parsed.files;
        if (parsed.activeTab) teamState.activeTab = parsed.activeTab;
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
  };
  
  // Try to load saved state
  loadState();
  
  // Create the header
  const header = document.createElement('div');
  header.className = 'border-b border-border p-2 flex justify-between items-center';
  header.innerHTML = `
    <h3 class="font-medium text-sm">Team Hub</h3>
    <div class="flex items-center gap-1">
      <button id="team-hub-settings" class="text-xs px-1 opacity-70 hover:opacity-100 bg-primary/10 rounded">⚙️</button>
      <button id="team-hub-collapse" class="text-xs px-1 opacity-70 hover:opacity-100">&minus;</button>
    </div>
  `;
  
  // Create the tabs
  const tabs = document.createElement('div');
  tabs.className = 'border-b border-border';
  tabs.innerHTML = `
    <div class="flex">
      <button data-tab="tasks" class="flex-1 py-1 text-xs font-medium ${teamState.activeTab === 'tasks' ? 'border-b-2 border-primary' : ''}">
        Tasks
      </button>
      <button data-tab="chat" class="flex-1 py-1 text-xs font-medium ${teamState.activeTab === 'chat' ? 'border-b-2 border-primary' : ''}">
        Chat
      </button>
      <button data-tab="files" class="flex-1 py-1 text-xs font-medium ${teamState.activeTab === 'files' ? 'border-b-2 border-primary' : ''}">
        Files
      </button>
    </div>
  `;
  
  // Create content container that will hold all tab contents
  const content = document.createElement('div');
  content.id = 'team-hub-content';
  content.className = 'p-3';
  
  // Function to render members section
  const renderMembers = () => {
    const membersSection = document.createElement('div');
    membersSection.className = 'mb-3';
    
    const membersHeader = document.createElement('div');
    membersHeader.className = 'text-xs text-muted-foreground mb-1 flex justify-between items-center';
    membersHeader.innerHTML = `
      <span>Team Members</span>
      <button id="invite-member" class="text-xs bg-primary/10 rounded px-1 hover:bg-primary/20">Invite</button>
    `;
    
    const membersContainer = document.createElement('div');
    membersContainer.className = 'flex flex-wrap gap-1';
    
    teamState.members.forEach(member => {
      if (member.isCurrentUser || member.name) {
        const memberEl = document.createElement('span');
        memberEl.className = `inline-flex items-center px-2 py-1 rounded-full text-xs ${
          member.isCurrentUser 
            ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
            : 'bg-accent/30 text-foreground border border-accent'
        }`;
        
        memberEl.innerHTML = `
          ${member.name} ${member.isCurrentUser ? '🟢' : member.status === 'online' ? '🟢' : '⚪'}
        `;
        
        membersContainer.appendChild(memberEl);
      }
    });
    
    membersSection.appendChild(membersHeader);
    membersSection.appendChild(membersContainer);
    
    return membersSection;
  };
  
  // Function to render tasks tab content
  const renderTasksTab = () => {
    const tasksTab = document.createElement('div');
    tasksTab.className = 'tasks-tab';
    tasksTab.appendChild(renderMembers());
    
    const tasksSection = document.createElement('div');
    tasksSection.className = 'tasks-section';
    
    const tasksHeader = document.createElement('div');
    tasksHeader.className = 'text-xs text-muted-foreground mb-1 flex justify-between items-center';
    tasksHeader.innerHTML = `
      <span>Tasks</span>
      <button id="add-task" class="text-xs bg-primary/10 rounded px-1 hover:bg-primary/20">+ Add</button>
    `;
    
    const tasksList = document.createElement('div');
    tasksList.className = 'space-y-1 tasks-list max-h-40 overflow-y-auto';
    
    teamState.tasks.forEach(task => {
      const taskItem = document.createElement('div');
      taskItem.className = 'flex items-center text-xs group';
      taskItem.dataset.taskId = task.id;
      taskItem.innerHTML = `
        <input type="checkbox" class="mr-2 task-checkbox" ${task.completed ? 'checked' : ''}>
        <span class="${task.completed ? 'line-through opacity-70' : ''}">${task.text}</span>
        <button class="ml-auto opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 task-delete">×</button>
      `;
      tasksList.appendChild(taskItem);
    });
    
    tasksSection.appendChild(tasksHeader);
    tasksSection.appendChild(tasksList);
    
    tasksTab.appendChild(tasksSection);
    return tasksTab;
  };
  
  // Function to render chat tab content
  const renderChatTab = () => {
    const chatTab = document.createElement('div');
    chatTab.className = 'chat-tab';
    chatTab.appendChild(renderMembers());
    
    const chatSection = document.createElement('div');
    chatSection.className = 'chat-section';
    
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'messages-container h-32 overflow-y-auto mb-2 p-1 border border-border/50 rounded bg-muted/30';
    
    teamState.messages.forEach(message => {
      const messageEl = document.createElement('div');
      messageEl.className = `message text-xs mb-1 ${message.sender === 'you' ? 'text-right' : ''}`;
      
      // Format the timestamp
      const time = new Date(message.time);
      const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
      
      if (message.sender === 'system') {
        messageEl.innerHTML = `<div class="inline-block bg-primary/5 text-muted-foreground py-1 px-2 rounded">${message.text}</div>`;
      } else {
        const isSelf = message.sender === 'you';
        messageEl.innerHTML = `
          <div class="flex items-end ${isSelf ? 'justify-end' : ''}">
            <div class="inline-block ${isSelf ? 'bg-primary/20 text-primary' : 'bg-accent/30'} py-1 px-2 rounded">
              ${message.text}
              <span class="text-[10px] opacity-70 ml-1">${timeStr}</span>
            </div>
          </div>
        `;
      }
      
      messagesContainer.appendChild(messageEl);
    });
    
    const chatForm = document.createElement('form');
    chatForm.className = 'chat-form flex gap-1';
    chatForm.innerHTML = `
      <input type="text" class="flex-1 text-xs p-1 border border-border rounded" placeholder="Type a message...">
      <button type="submit" class="bg-primary text-primary-foreground rounded px-2 py-1 text-xs">Send</button>
    `;
    
    chatSection.appendChild(messagesContainer);
    chatSection.appendChild(chatForm);
    
    chatTab.appendChild(chatSection);
    return chatTab;
  };
  
  // Function to render files tab content
  const renderFilesTab = () => {
    const filesTab = document.createElement('div');
    filesTab.className = 'files-tab';
    filesTab.appendChild(renderMembers());
    
    const filesSection = document.createElement('div');
    filesSection.className = 'files-section';
    
    const filesHeader = document.createElement('div');
    filesHeader.className = 'text-xs text-muted-foreground mb-1 flex justify-between items-center';
    filesHeader.innerHTML = `
      <span>Shared Files</span>
      <button id="share-file" class="text-xs bg-primary/10 rounded px-1 hover:bg-primary/20">+ Share</button>
    `;
    
    const filesList = document.createElement('div');
    filesList.className = 'space-y-1';
    
    if (teamState.files.length === 0) {
      filesList.innerHTML = '<div class="text-xs text-muted-foreground italic">No files shared yet</div>';
    } else {
      teamState.files.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'flex items-center text-xs p-1 hover:bg-accent/10 rounded group';
        fileItem.dataset.fileId = file.id;
        
        // Determine icon based on file extension
        let icon = '📄';
        if (file.name.endsWith('.pdf')) icon = '📕';
        else if (file.name.endsWith('.jpg') || file.name.endsWith('.png')) icon = '🖼️';
        else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) icon = '📝';
        else if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) icon = '📊';
        
        fileItem.innerHTML = `
          <span class="mr-1">${icon}</span>
          <span>${file.name}</span>
          <span class="text-muted-foreground ml-1">(${file.size})</span>
          <button class="ml-auto opacity-0 group-hover:opacity-100 text-primary hover:text-primary/80">⬇️</button>
        `;
        filesList.appendChild(fileItem);
      });
    }
    
    filesSection.appendChild(filesHeader);
    filesSection.appendChild(filesList);
    
    filesTab.appendChild(filesSection);
    return filesTab;
  };
  
  // Function to render the active tab
  const renderActiveTab = () => {
    content.innerHTML = '';
    
    switch(teamState.activeTab) {
      case 'tasks':
        content.appendChild(renderTasksTab());
        break;
      case 'chat':
        content.appendChild(renderChatTab());
        break;
      case 'files':
        content.appendChild(renderFilesTab());
        break;
    }
    
    // Setup event listeners for the active tab
    setupEventListeners();
  };
  
  // Function to setup event listeners
  const setupEventListeners = () => {
    // Task checkbox event listeners
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const taskId = (e.target as HTMLElement).closest('[data-task-id]')?.getAttribute('data-task-id');
        if (taskId) {
          const task = teamState.tasks.find(t => t.id === taskId);
          if (task) {
            task.completed = (e.target as HTMLInputElement).checked;
            saveState();
            
            // Update task appearance
            const taskText = (e.target as HTMLElement).nextElementSibling;
            if (taskText) {
              if (task.completed) {
                taskText.classList.add('line-through', 'opacity-70');
              } else {
                taskText.classList.remove('line-through', 'opacity-70');
              }
            }
          }
        }
      });
    });
    
    // Task delete button event listeners
    document.querySelectorAll('.task-delete').forEach(button => {
      button.addEventListener('click', (e) => {
        const taskId = (e.target as HTMLElement).closest('[data-task-id]')?.getAttribute('data-task-id');
        if (taskId) {
          const taskIndex = teamState.tasks.findIndex(t => t.id === taskId);
          if (taskIndex !== -1) {
            teamState.tasks.splice(taskIndex, 1);
            saveState();
            renderActiveTab(); // Re-render to update UI
          }
        }
      });
    });
    
    // Add task button
    const addTaskBtn = document.getElementById('add-task');
    if (addTaskBtn) {
      addTaskBtn.addEventListener('click', () => {
        // Create a prompt to add a new task
        const taskText = prompt('Enter task description:');
        if (taskText && taskText.trim()) {
          const newTask = {
            id: 'task' + Date.now(),
            text: taskText.trim(),
            completed: false
          };
          teamState.tasks.push(newTask);
          saveState();
          renderActiveTab(); // Re-render to update UI
        }
      });
    }
    
    // Invite member button
    const inviteBtn = document.getElementById('invite-member');
    if (inviteBtn) {
      inviteBtn.addEventListener('click', () => {
        const memberName = prompt('Enter team member name:');
        if (memberName && memberName.trim()) {
          const emptyMember = teamState.members.find(m => !m.name && !m.isCurrentUser);
          if (emptyMember) {
            emptyMember.name = memberName.trim();
            emptyMember.status = Math.random() > 0.5 ? 'online' : 'offline';
            saveState();
            renderActiveTab(); // Re-render to update UI
            
            // Show a toast to the user
            toast({
              title: "Team Member Added",
              description: `${memberName} has been added to your team.`,
            });
          } else {
            alert('Maximum team size reached');
          }
        }
      });
    }
    
    // Chat form submission
    const chatForm = document.querySelector('.chat-form');
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = chatForm.querySelector('input') as HTMLInputElement;
        const message = input.value.trim();
        
        if (message) {
          const newMessage = {
            id: 'msg' + Date.now(),
            sender: 'you',
            text: message,
            time: new Date().toISOString()
          };
          teamState.messages.push(newMessage);
          saveState();
          input.value = '';
          renderActiveTab(); // Re-render to update UI
          
          // Simulate a response after a short delay
          setTimeout(() => {
            const responseOptions = [
              "Great idea! Let's discuss this further.",
              "I think we should focus on the core features first.",
              "Can you share more details about this?",
              "I'll work on this part of the project.",
              "Let's talk about this during our next team meeting."
            ];
            
            const randomMember = teamState.members.find(m => !m.isCurrentUser && m.name);
            if (randomMember) {
              const responseMessage = {
                id: 'msg' + Date.now(),
                sender: randomMember.id,
                text: responseOptions[Math.floor(Math.random() * responseOptions.length)],
                time: new Date().toISOString()
              };
              teamState.messages.push(responseMessage);
              saveState();
              renderActiveTab(); // Re-render to update UI
            }
          }, 2000 + Math.random() * 3000);
        }
      });
    }
    
    // Share file button
    const shareFileBtn = document.getElementById('share-file');
    if (shareFileBtn) {
      shareFileBtn.addEventListener('click', () => {
        // Create a modal or simple prompt to "upload" a file
        const fileTypes = ["Project Plan.pdf", "API Documentation.pdf", "User Flow Diagram.png", "Database Schema.pdf", "Requirements Doc.docx", "Project Timeline.xlsx"];
        const fileName = fileTypes[Math.floor(Math.random() * fileTypes.length)];
        const fileSize = (Math.random() * 5 + 0.5).toFixed(1) + ' MB';
        
        const newFile = {
          id: 'file' + Date.now(),
          name: fileName,
          size: fileSize,
          shared: true
        };
        
        teamState.files.push(newFile);
        saveState();
        renderActiveTab(); // Re-render to update UI
        
        // Show a toast to the user
        toast({
          title: "File Shared",
          description: `${fileName} has been shared with your team.`,
        });
      });
    }
  };
  
  // Add panel elements to DOM
  teamPanel.appendChild(header);
  teamPanel.appendChild(tabs);
  teamPanel.appendChild(content);
  
  // Add event listeners for tabs
  const setupTabEventListeners = () => {
    const tabButtons = tabs.querySelectorAll('[data-tab]');
    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const tabName = (e.currentTarget as HTMLElement).getAttribute('data-tab');
        if (tabName && tabName !== teamState.activeTab) {
          teamState.activeTab = tabName;
          saveState();
          
          // Update active tab styling
          tabButtons.forEach(btn => {
            (btn as HTMLElement).classList.remove('border-b-2', 'border-primary');
          });
          (e.currentTarget as HTMLElement).classList.add('border-b-2', 'border-primary');
          
          // Render the selected tab content
          renderActiveTab();
        }
      });
    });
  };
  
  // Add collapse/expand functionality
  const setupPanelControls = () => {
    const collapseBtn = teamPanel.querySelector('#team-hub-collapse');
    const panelContent = teamPanel.querySelector('#team-hub-content');
    
    if (collapseBtn && panelContent) {
      collapseBtn.addEventListener('click', () => {
        if ((panelContent as HTMLElement).style.display === 'none') {
          (panelContent as HTMLElement).style.display = 'block';
          collapseBtn.textContent = '−';
        } else {
          (panelContent as HTMLElement).style.display = 'none';
          collapseBtn.textContent = '+';
        }
      });
    }
    
    // Settings button
    const settingsBtn = teamPanel.querySelector('#team-hub-settings');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        // Toggle between light and dark theme for the panel
        if (teamPanel.classList.contains('dark-theme')) {
          teamPanel.classList.remove('dark-theme');
          toast({
            title: "Light Theme",
            description: "Team Hub is now using light theme.",
          });
        } else {
          teamPanel.classList.add('dark-theme');
          toast({
            title: "Dark Theme",
            description: "Team Hub is now using dark theme.",
          });
        }
      });
    }
  };
  
  // Initialize the panel
  setupTabEventListeners();
  renderActiveTab();
  setupPanelControls();
  
  return teamPanel;
};

// Function to create a simple API tester
const createApiTester = () => {
  const apiTester = document.createElement('div');
  apiTester.id = 'api-tester';
  apiTester.className = 'fixed top-14 right-4 bg-background border border-border rounded-md shadow-md z-50 w-80';
  
  const header = document.createElement('div');
  header.className = 'border-b border-border p-2 flex justify-between items-center';
  header.innerHTML = `
    <h3 class="font-medium text-sm">API Tester</h3>
    <button id="api-tester-close" class="text-xs opacity-70 hover:opacity-100">&times;</button>
  `;
  
  const content = document.createElement('div');
  content.className = 'p-3 space-y-3';
  content.innerHTML = `
    <div>
      <label class="text-xs text-muted-foreground block mb-1">Request Method</label>
      <select class="w-full p-1 text-sm border border-border rounded-md bg-background">
        <option>GET</option>
        <option>POST</option>
        <option>PUT</option>
        <option>DELETE</option>
        <option>PATCH</option>
      </select>
    </div>
    <div>
      <label class="text-xs text-muted-foreground block mb-1">URL</label>
      <input type="text" class="w-full p-1 text-sm border border-border rounded-md bg-background" placeholder="https://api.example.com/endpoint">
    </div>
    <div>
      <label class="text-xs text-muted-foreground block mb-1">Request Body (JSON)</label>
      <textarea class="w-full p-1 text-sm border border-border rounded-md bg-background h-20 font-mono" placeholder='{
  "key": "value"
}'></textarea>
    </div>
    <button class="w-full bg-primary text-primary-foreground rounded-md p-1 text-sm">Send Request</button>
    
    <div class="border-t border-border pt-3 mt-3">
      <div class="text-xs text-muted-foreground mb-1">Response</div>
      <div class="bg-muted p-2 rounded-md text-xs font-mono h-24 overflow-auto">
        // Response will appear here
      </div>
    </div>
  `;
  
  apiTester.appendChild(header);
  apiTester.appendChild(content);
  
  // Add close functionality
  setTimeout(() => {
    const closeBtn = apiTester.querySelector('#api-tester-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        apiTester.remove();
      });
    }
  }, 100);
  
  return apiTester;
};

// Function to create a simple ideation board
const createIdeationBoard = () => {
  const board = document.createElement('div');
  board.className = 'fixed inset-0 bg-background flex flex-col z-50';
  board.id = 'ideation-board';
  
  board.innerHTML = `
    <div class="flex items-center justify-between p-2 border-b border-border">
      <h3 class="text-lg font-medium">Ideation Board</h3>
      <button id="close-ideation-board" class="bg-muted text-muted-foreground px-2 py-1 rounded text-sm">Close</button>
    </div>
    
    <div class="flex-1 bg-muted/30 p-4 overflow-auto" id="board-canvas">
      <div class="sticky-note" style="top: 50px; left: 100px" data-id="note-1">
        <div class="sticky-note-content">
          <h4 contenteditable="true">Core App Idea</h4>
          <p contenteditable="true">A platform that connects hackathon participants with mentors in real-time</p>
          <button class="note-delete">×</button>
        </div>
      </div>
      <div class="sticky-note" style="top: 150px; left: 300px" data-id="note-2">
        <div class="sticky-note-content">
          <h4 contenteditable="true">Key Features</h4>
          <ul contenteditable="true">
            <li>Video chat</li>
            <li>Skill matching</li>
            <li>Scheduling</li>
          </ul>
          <button class="note-delete">×</button>
        </div>
      </div>
      <div class="sticky-note" style="top: 250px; left: 180px" data-id="note-3">
        <div class="sticky-note-content">
          <h4 contenteditable="true">Tech Stack</h4>
          <p contenteditable="true">React, Node.js, WebRTC</p>
          <button class="note-delete">×</button>
        </div>
      </div>
      <div class="sticky-note" style="top: 100px; left: 500px" data-id="note-4">
        <div class="sticky-note-content">
          <h4 contenteditable="true">User Flow</h4>
          <p contenteditable="true">Sign up → Create profile → Find mentor → Schedule session → Connect</p>
          <button class="note-delete">×</button>
        </div>
      </div>
    </div>
    
    <div class="flex gap-2 p-2 border-t border-border">
      <button id="add-note" class="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-sm hover:bg-yellow-300 transition-colors">Add Note</button>
      <button id="add-connection" class="bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm hover:bg-blue-300 transition-colors">Add Connection</button>
      <button id="save-board" class="bg-green-200 text-green-800 px-2 py-1 rounded text-sm hover:bg-green-300 transition-colors">Save Board</button>
      <button id="export-board" class="bg-purple-200 text-purple-800 px-2 py-1 rounded text-sm hover:bg-purple-300 transition-colors">Export as Image</button>
    </div>
  `;
  
  // Add sticky note styles
  const styles = document.createElement('style');
  styles.id = 'ideation-board-styles';
  styles.innerHTML = `
    .sticky-note {
      position: absolute;
      width: 200px;
      min-height: 180px;
      background-color: #ffeb3b;
      padding: 10px;
      border-radius: 2px;
      box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
      cursor: move;
      transition: box-shadow 0.3s ease;
    }
    .sticky-note:hover {
      box-shadow: 3px 3px 12px rgba(0,0,0,0.2);
    }
    .sticky-note-content {
      width: 100%;
      height: 100%;
      position: relative;
    }
    .sticky-note h4 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: bold;
      color: #333;
      padding: 2px;
      border-radius: 3px;
    }
    .sticky-note h4:focus, .sticky-note p:focus, .sticky-note ul:focus {
      outline: 1px solid rgba(0,0,0,0.1);
      background-color: rgba(255,255,255,0.4);
    }
    .sticky-note p, .sticky-note ul {
      margin: 0;
      font-size: 12px;
      color: #555;
      padding: 2px;
      border-radius: 3px;
    }
    .sticky-note ul {
      padding-left: 16px;
    }
    .note-delete {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #ff5252;
      color: white;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      visibility: hidden;
      opacity: 0;
      transition: visibility 0s, opacity 0.2s;
    }
    .sticky-note:hover .note-delete {
      visibility: visible;
      opacity: 1;
    }
    .connection-line {
      position: absolute;
      background-color: #2196F3;
      height: 2px;
      transform-origin: left center;
      pointer-events: none;
      z-index: -1;
    }
  `;
  
  document.head.appendChild(styles);
  document.body.appendChild(board);
  
  // Initialize the interactivity once the board is added to DOM
  setTimeout(() => {
    initIdeationBoardFunctionality();
  }, 100);
  
  return board;
};

// Function to initialize drag, edit, and create functionality for the ideation board
function initIdeationBoardFunctionality() {
  const canvas = document.getElementById('board-canvas');
  const closeButton = document.getElementById('close-ideation-board');
  const addNoteButton = document.getElementById('add-note');
  const addConnectionButton = document.getElementById('add-connection');
  const saveButton = document.getElementById('save-board');
  const exportButton = document.getElementById('export-board');
  
  if (!canvas || !closeButton || !addNoteButton || !addConnectionButton || !saveButton || !exportButton) return;
  
  // Close button functionality
  closeButton.addEventListener('click', () => {
    const board = document.getElementById('ideation-board');
    const styles = document.getElementById('ideation-board-styles');
    if (board) board.remove();
    if (styles) styles.remove();
  });
  
  // Make notes draggable
  let activeNote = null;
  let initialX = 0;
  let initialY = 0;
  let offsetX = 0;
  let offsetY = 0;
  
  document.querySelectorAll('.sticky-note').forEach(note => {
    initializeNoteDragging(note);
    initializeNoteDeleteButton(note);
  });
  
  function initializeNoteDragging(note) {
    note.addEventListener('mousedown', e => {
      // Skip if clicking on editable content or delete button
      if (e.target.isContentEditable || e.target.classList.contains('note-delete')) return;
      
      activeNote = note;
      initialX = e.clientX;
      initialY = e.clientY;
      
      const rect = note.getBoundingClientRect();
      offsetX = initialX - rect.left;
      offsetY = initialY - rect.top;
      
      note.style.zIndex = '100';
      document.addEventListener('mousemove', moveNote);
      document.addEventListener('mouseup', stopMoveNote);
    });
  }
  
  function initializeNoteDeleteButton(note) {
    const deleteBtn = note.querySelector('.note-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        note.remove();
        updateConnections();
      });
    }
  }
  
  function moveNote(e) {
    if (!activeNote) return;
    
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    
    // Calculate position relative to canvas
    const canvasRect = canvas.getBoundingClientRect();
    const canvasX = x - canvasRect.left;
    const canvasY = y - canvasRect.top;
    
    activeNote.style.left = `${canvasX}px`;
    activeNote.style.top = `${canvasY}px`;
    
    updateConnections();
  }
  
  function stopMoveNote() {
    if (!activeNote) return;
    
    activeNote.style.zIndex = '';
    activeNote = null;
    document.removeEventListener('mousemove', moveNote);
    document.removeEventListener('mouseup', stopMoveNote);
  }
  
  // Add new sticky note
  let noteCounter = document.querySelectorAll('.sticky-note').length;
  
  addNoteButton.addEventListener('click', () => {
    noteCounter++;
    const noteId = `note-${Date.now()}`;
    const noteElement = document.createElement('div');
    noteElement.className = 'sticky-note';
    noteElement.setAttribute('data-id', noteId);
    noteElement.style.top = `${Math.random() * 200 + 50}px`;
    noteElement.style.left = `${Math.random() * 400 + 100}px`;
    
    noteElement.innerHTML = `
      <div class="sticky-note-content">
        <h4 contenteditable="true">New Note</h4>
        <p contenteditable="true">Click to edit</p>
        <button class="note-delete">×</button>
      </div>
    `;
    
    canvas.appendChild(noteElement);
    initializeNoteDragging(noteElement);
    initializeNoteDeleteButton(noteElement);
  });
  
  // Connection lines between notes
  let drawingConnection = false;
  let startNote = null;
  let connections = [];
  
  addConnectionButton.addEventListener('click', () => {
    if (drawingConnection) {
      drawingConnection = false;
      document.body.style.cursor = '';
      startNote = null;
      return;
    }
    
    drawingConnection = true;
    document.body.style.cursor = 'crosshair';
  });
  
  canvas.addEventListener('click', (e) => {
    if (!drawingConnection) return;
    
    // Check if clicking on a note
    let targetNote = null;
    document.querySelectorAll('.sticky-note').forEach(note => {
      const rect = note.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right && 
          e.clientY >= rect.top && e.clientY <= rect.bottom) {
        targetNote = note;
      }
    });
    
    if (!targetNote) return;
    
    if (!startNote) {
      startNote = targetNote;
    } else if (startNote !== targetNote) {
      // Create connection
      const connection = {
        from: startNote.dataset.id,
        to: targetNote.dataset.id
      };
      connections.push(connection);
      drawConnection(connection);
      
      // Reset
      drawingConnection = false;
      document.body.style.cursor = '';
      startNote = null;
    }
  });
  
  function drawConnection(connection) {
    const fromNote = document.querySelector(`.sticky-note[data-id="${connection.from}"]`);
    const toNote = document.querySelector(`.sticky-note[data-id="${connection.to}"]`);
    
    if (!fromNote || !toNote) return;
    
    const fromRect = fromNote.getBoundingClientRect();
    const toRect = toNote.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    
    const fromX = (fromRect.left + fromRect.right) / 2 - canvasRect.left;
    const fromY = (fromRect.top + fromRect.bottom) / 2 - canvasRect.top;
    const toX = (toRect.left + toRect.right) / 2 - canvasRect.left;
    const toY = (toRect.top + toRect.bottom) / 2 - canvasRect.top;
    
    const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    const line = document.createElement('div');
    line.className = 'connection-line';
    line.setAttribute('data-from', connection.from);
    line.setAttribute('data-to', connection.to);
    
    line.style.width = `${length}px`;
    line.style.left = `${fromX}px`;
    line.style.top = `${fromY}px`;
    line.style.transform = `rotate(${angle}rad)`;
    
    canvas.appendChild(line);
  }
  
  function updateConnections() {
    // Remove all connection lines
    document.querySelectorAll('.connection-line').forEach(line => line.remove());
    
    // Redraw connections
    connections.forEach(connection => {
      drawConnection(connection);
    });
  }
  
  // Save the current state
  saveButton.addEventListener('click', () => {
    const boardState = {
      notes: [],
      connections: connections
    };
    
    document.querySelectorAll('.sticky-note').forEach(note => {
      boardState.notes.push({
        id: (note as HTMLElement).dataset.id,
        top: (note as HTMLElement).style.top,
        left: (note as HTMLElement).style.left,
        title: note.querySelector('h4').innerText,
        content: note.querySelector('p') ? note.querySelector('p').innerText : 
                (note.querySelector('ul') ? note.querySelector('ul').innerHTML : '')
      });
    });
    
    localStorage.setItem('ideationBoardState', JSON.stringify(boardState));
    
    toast({
      title: "Board Saved",
      description: "Your ideation board has been saved locally.",
    });
  });
  
  // Export as image
  exportButton.addEventListener('click', () => {
    toast({
      title: "Export Feature",
      description: "Preparing your board for download...",
    });
    
    // Simple version - this would typically use html2canvas or similar library
    setTimeout(() => {
      toast({
        title: "Board Exported",
        description: "Your ideation board has been exported (simulated).",
      });
    }, 1500);
  });
}

// Function to create a fully interactive pitch deck creator
const createPitchDeckCreator = () => {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
  modal.id = 'pitch-deck-modal';
  
  // Initial modal with template selection
  modal.innerHTML = `
    <div class="bg-background p-4 rounded-md shadow-xl w-4/5 max-w-3xl h-4/5 flex flex-col">
      <div class="flex justify-between items-center mb-4 pb-2 border-b border-border">
        <h3 class="text-lg font-medium">Pitch Deck Creator</h3>
        <button id="close-pitch-modal" class="text-muted-foreground hover:text-foreground">&times;</button>
      </div>
      
      <div class="overflow-auto flex-1">
        <div id="template-selection" class="block">
          <h4 class="text-sm font-medium mb-2">Select a Template</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="border border-border p-2 rounded-md hover:border-primary cursor-pointer template-card" data-template="minimal">
              <div class="aspect-video bg-muted rounded-sm mb-2 flex items-center justify-center">
                <div class="w-3/4 h-1/2 border border-border/50 bg-background rounded flex items-center justify-center text-xs">
                  Minimal Style
                </div>
              </div>
              <div class="text-sm font-medium">Minimal</div>
              <div class="text-xs text-muted-foreground">Clean, simple design</div>
            </div>
            <div class="border border-border p-2 rounded-md hover:border-primary cursor-pointer template-card" data-template="tech">
              <div class="aspect-video bg-blue-50 dark:bg-blue-950 rounded-sm mb-2 flex items-center justify-center">
                <div class="w-3/4 h-1/2 bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded flex items-center justify-center text-xs">
                  Tech Style
                </div>
              </div>
              <div class="text-sm font-medium">Tech</div>
              <div class="text-xs text-muted-foreground">Digital theme with blue accents</div>
            </div>
            <div class="border border-border p-2 rounded-md hover:border-primary cursor-pointer template-card" data-template="impact">
              <div class="aspect-video bg-orange-50 dark:bg-orange-950 rounded-sm mb-2 flex items-center justify-center">
                <div class="w-3/4 h-1/2 bg-orange-100 dark:bg-orange-900 border border-orange-200 dark:border-orange-800 rounded flex items-center justify-center text-xs">
                  Impact Style
                </div>
              </div>
              <div class="text-sm font-medium">Impact</div>
              <div class="text-xs text-muted-foreground">Bold statements with accent colors</div>
            </div>
          </div>
          
          <div class="mt-8">
            <h4 class="text-sm font-medium mb-2">Quick Start Templates</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="border border-border p-2 rounded-md hover:border-primary cursor-pointer template-card" data-template="startup">
                <div class="flex items-center">
                  <div class="w-24 h-16 bg-muted rounded-sm flex items-center justify-center text-xs">
                    Startup
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium">Startup Pitch</div>
                    <div class="text-xs text-muted-foreground">8 slides with problem/solution focus</div>
                  </div>
                </div>
              </div>
              <div class="border border-border p-2 rounded-md hover:border-primary cursor-pointer template-card" data-template="hackathon">
                <div class="flex items-center">
                  <div class="w-24 h-16 bg-muted rounded-sm flex items-center justify-center text-xs">
                    Hackathon
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium">Hackathon Project</div>
                    <div class="text-xs text-muted-foreground">6 slides with demo emphasis</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div id="deck-editor" class="hidden">
          <!-- This will be populated with the slide editor -->
        </div>
      </div>
      
      <div class="pt-3 mt-3 border-t border-border flex justify-between">
        <div>
          <button id="back-to-templates" class="bg-muted text-muted-foreground px-3 py-1.5 rounded text-sm hidden">
            &larr; Back to Templates
          </button>
        </div>
        <div>
          <button id="cancel-deck" class="bg-muted text-muted-foreground px-3 py-1.5 rounded text-sm mr-2">Cancel</button>
          <button id="create-new-deck" class="bg-primary text-primary-foreground px-3 py-1.5 rounded text-sm">Create New</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add event listeners once the modal is added to the DOM
  setTimeout(() => {
    initPitchDeckCreatorEvents();
  }, 100);
  
  return modal;
};

// Initialize all pitch deck creator event handlers
function initPitchDeckCreatorEvents() {
  const closeButton = document.getElementById('close-pitch-modal');
  const cancelButton = document.getElementById('cancel-deck');
  const createButton = document.getElementById('create-new-deck');
  const backButton = document.getElementById('back-to-templates');
  const templateCards = document.querySelectorAll('.template-card');
  
  if (!closeButton || !cancelButton || !createButton || !backButton) return;
  
  const closeModal = () => {
    const modal = document.getElementById('pitch-deck-modal');
    if (modal) modal.remove();
    
    // Remove any styles we added
    const styles = document.getElementById('pitch-deck-styles');
    if (styles) styles.remove();
  };
  
  // Close and cancel buttons
  closeButton.addEventListener('click', closeModal);
  cancelButton.addEventListener('click', closeModal);
  
  // Back button to return to template selection
  backButton.addEventListener('click', () => {
    const templateSelection = document.getElementById('template-selection');
    const deckEditor = document.getElementById('deck-editor');
    
    if (templateSelection && deckEditor) {
      templateSelection.classList.remove('hidden');
      templateSelection.classList.add('block');
      deckEditor.classList.add('hidden');
      backButton.classList.add('hidden');
      createButton.textContent = 'Create New';
    }
  });
  
  // Template selection
  templateCards.forEach(card => {
    card.addEventListener('click', () => {
      const templateType = card.getAttribute('data-template');
      if (!templateType) return;
      
      // Show the deck editor and hide template selection
      const templateSelection = document.getElementById('template-selection');
      const deckEditor = document.getElementById('deck-editor');
      
      if (templateSelection && deckEditor) {
        templateSelection.classList.add('hidden');
        deckEditor.classList.remove('hidden');
        backButton.classList.remove('hidden');
        createButton.textContent = 'Export';
        
        // Load the selected template into the editor
        loadPitchDeckTemplate(templateType, deckEditor);
      }
    });
  });
  
  // Create/Export button functionality changes based on view
  createButton.addEventListener('click', () => {
    const deckEditor = document.getElementById('deck-editor');
    
    if (deckEditor && !deckEditor.classList.contains('hidden')) {
      // We're in editor view, so this is now an export button
      exportPitchDeck();
    } else {
      // We're in template selection, create a blank deck
      const templateSelection = document.getElementById('template-selection');
      if (templateSelection) {
        templateSelection.classList.add('hidden');
        
        const deckEditor = document.getElementById('deck-editor');
        if (deckEditor) {
          deckEditor.classList.remove('hidden');
          backButton.classList.remove('hidden');
          createButton.textContent = 'Export';
          
          // Load a blank template
          loadPitchDeckTemplate('blank', deckEditor);
        }
      }
    }
  });
  
  // Add pitch deck styles
  const styles = document.createElement('style');
  styles.id = 'pitch-deck-styles';
  styles.innerHTML = `
    .slide {
      aspect-ratio: 16/9;
      background-color: white;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      position: relative;
      margin-bottom: 20px;
      overflow: hidden;
    }
    
    .slide-content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 20px;
      display: flex;
      flex-direction: column;
    }
    
    .slide-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 12px;
      outline: none;
    }
    
    .slide-body {
      font-size: 16px;
      flex-grow: 1;
      outline: none;
    }
    
    .slide-tools {
      position: absolute;
      top: 5px;
      right: 5px;
      display: flex;
      gap: 5px;
      opacity: 0;
      transition: opacity 0.2s;
    }
    
    .slide:hover .slide-tools {
      opacity: 1;
    }
    
    .slide-tool-button {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      background-color: rgba(0,0,0,0.1);
      color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 12px;
    }
    
    .slide-tool-button:hover {
      background-color: rgba(0,0,0,0.2);
    }
    
    .dark .slide {
      background-color: #1e1e1e;
      color: #e0e0e0;
    }
    
    .dark .slide-tool-button {
      background-color: rgba(255,255,255,0.1);
      color: #e0e0e0;
    }
    
    .dark .slide-tool-button:hover {
      background-color: rgba(255,255,255,0.2);
    }
    
    /* Template styles */
    .template-tech .slide {
      background-color: #f0f8ff;
      color: #00308f;
    }
    
    .template-tech .slide-title {
      color: #0066cc;
      border-bottom: 2px solid #0066cc;
      padding-bottom: 8px;
    }
    
    .dark .template-tech .slide {
      background-color: #0a2642;
      color: #e6f0ff;
    }
    
    .dark .template-tech .slide-title {
      color: #66b2ff;
      border-bottom: 2px solid #66b2ff;
    }
    
    .template-impact .slide {
      background-color: #fff8f0;
      color: #663300;
    }
    
    .template-impact .slide-title {
      color: #ff6600;
      font-size: 28px;
      text-transform: uppercase;
    }
    
    .dark .template-impact .slide {
      background-color: #2e1700;
      color: #ffd9b3;
    }
    
    .dark .template-impact .slide-title {
      color: #ff944d;
    }
    
    .slide-controls {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
    }
    
    .slide-control-button {
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
    }
  `;
  document.head.appendChild(styles);
}

// Load a template into the deck editor
function loadPitchDeckTemplate(templateType, editorElement) {
  // Define template structures
  const templates = {
    minimal: {
      className: 'template-minimal',
      slides: [
        { title: 'Project Title', content: 'Team members' },
        { title: 'Problem', content: 'What problem are you solving?' },
        { title: 'Solution', content: 'How does your project solve this problem?' },
        { title: 'Demo', content: 'Show your project in action' },
        { title: 'Technical Implementation', content: 'How did you build it? What technologies did you use?' },
        { title: 'Future Plans', content: 'What is next for your project?' }
      ]
    },
    tech: {
      className: 'template-tech',
      slides: [
        { title: 'Project Name', content: 'A short tagline that describes your project' },
        { title: 'The Problem', content: 'What challenge does your solution address?' },
        { title: 'Our Solution', content: 'Describe your technical approach' },
        { title: 'Key Features', content: '• Feature 1\n• Feature 2\n• Feature 3' },
        { title: 'Architecture', content: 'Describe your technical architecture here' },
        { title: 'Demo', content: 'Screenshots or live demonstration' },
        { title: 'Future Development', content: 'Where is this project headed next?' }
      ]
    },
    impact: {
      className: 'template-impact',
      slides: [
        { title: 'Make an Impact', content: 'Your project name and team' },
        { title: 'The Challenge', content: 'What big problem are you taking on?' },
        { title: 'Our Bold Solution', content: 'How are you solving it differently?' },
        { title: 'Why It Matters', content: 'The impact your solution will have' },
        { title: 'See It In Action', content: 'Demo of your solution' },
        { title: 'Join Our Mission', content: 'Call to action and next steps' }
      ]
    },
    startup: {
      className: 'template-minimal',
      slides: [
        { title: 'Company Name', content: 'Your tagline here' },
        { title: 'The Problem', content: 'What pain point are you addressing?' },
        { title: 'Target Market', content: 'Who are your customers? Market size?' },
        { title: 'Solution', content: 'Your product and its key benefits' },
        { title: 'Business Model', content: 'How will you make money?' },
        { title: 'Competitive Advantage', content: 'What makes you different?' },
        { title: 'Traction', content: 'Progress made so far and milestones' },
        { title: 'Team', content: 'Who is behind this project?' }
      ]
    },
    hackathon: {
      className: 'template-tech',
      slides: [
        { title: 'Project Name', content: 'Team members and project tagline' },
        { title: 'The Problem & Solution', content: 'Brief explanation of the problem and your solution' },
        { title: 'Technical Implementation', content: 'How you built it and technical challenges overcome' },
        { title: 'Demo', content: 'Show your project in action' },
        { title: 'Innovation & Impact', content: 'What makes your project unique and impactful' },
        { title: 'Future Development', content: 'Where would you take this project with more time?' }
      ]
    },
    blank: {
      className: 'template-minimal',
      slides: [
        { title: 'Your Title', content: 'Click to edit content' }
      ]
    }
  };
  
  // Get the template structure
  const template = templates[templateType] || templates.blank;
  
  // Create the slide controls
  const slidesHTML = `
    <div class="slide-controls">
      <button class="slide-control-button bg-muted hover:bg-muted/75" id="add-slide-btn">+ Add Slide</button>
      <button class="slide-control-button bg-muted hover:bg-muted/75" id="change-style-btn">Change Style</button>
    </div>
    <div class="slides-container ${template.className}">
      ${template.slides.map((slide, index) => `
        <div class="slide" data-slide-index="${index}">
          <div class="slide-content">
            <div class="slide-title" contenteditable="true">${slide.title}</div>
            <div class="slide-body" contenteditable="true">${slide.content}</div>
          </div>
          <div class="slide-tools">
            <div class="slide-tool-button slide-move-up" title="Move Up">↑</div>
            <div class="slide-tool-button slide-move-down" title="Move Down">↓</div>
            <div class="slide-tool-button slide-duplicate" title="Duplicate">+</div>
            <div class="slide-tool-button slide-delete" title="Delete">×</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  // Set the HTML content
  editorElement.innerHTML = slidesHTML;
  
  // Add event listeners for slide controls
  setTimeout(() => {
    initSlideControls();
  }, 100);
}

// Initialize all the slide control buttons
function initSlideControls() {
  // Add new slide button
  const addSlideBtn = document.getElementById('add-slide-btn');
  if (addSlideBtn) {
    addSlideBtn.addEventListener('click', () => {
      const slidesContainer = document.querySelector('.slides-container');
      const slideIndex = document.querySelectorAll('.slide').length;
      
      const newSlide = document.createElement('div');
      newSlide.className = 'slide';
      newSlide.setAttribute('data-slide-index', slideIndex.toString());
      
      newSlide.innerHTML = `
        <div class="slide-content">
          <div class="slide-title" contenteditable="true">New Slide</div>
          <div class="slide-body" contenteditable="true">Add your content here</div>
        </div>
        <div class="slide-tools">
          <div class="slide-tool-button slide-move-up" title="Move Up">↑</div>
          <div class="slide-tool-button slide-move-down" title="Move Down">↓</div>
          <div class="slide-tool-button slide-duplicate" title="Duplicate">+</div>
          <div class="slide-tool-button slide-delete" title="Delete">×</div>
        </div>
      `;
      
      slidesContainer.appendChild(newSlide);
      
      // Add event listeners to the new slide's buttons
      addSlideButtonHandlers(newSlide);
      
      // Scroll to the new slide
      newSlide.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
  
  // Change style button
  const changeStyleBtn = document.getElementById('change-style-btn');
  if (changeStyleBtn) {
    changeStyleBtn.addEventListener('click', () => {
      const slidesContainer = document.querySelector('.slides-container');
      if (!slidesContainer) return;
      
      // Rotate between styles
      if (slidesContainer.classList.contains('template-minimal')) {
        slidesContainer.classList.remove('template-minimal');
        slidesContainer.classList.add('template-tech');
        toast({ title: "Style Changed", description: "Applied Tech theme to your slides." });
      } else if (slidesContainer.classList.contains('template-tech')) {
        slidesContainer.classList.remove('template-tech');
        slidesContainer.classList.add('template-impact');
        toast({ title: "Style Changed", description: "Applied Impact theme to your slides." });
      } else {
        slidesContainer.classList.remove('template-impact');
        slidesContainer.classList.add('template-minimal');
        toast({ title: "Style Changed", description: "Applied Minimal theme to your slides." });
      }
    });
  }
  
  // Add event handlers to all slide buttons
  document.querySelectorAll('.slide').forEach(slide => {
    addSlideButtonHandlers(slide);
  });
}

// Add event handlers to a slide's control buttons
function addSlideButtonHandlers(slide) {
  // Move slide up
  const moveUpBtn = slide.querySelector('.slide-move-up');
  if (moveUpBtn) {
    moveUpBtn.addEventListener('click', () => {
      const prevSlide = slide.previousElementSibling;
      if (prevSlide && prevSlide.classList.contains('slide')) {
        slide.parentNode.insertBefore(slide, prevSlide);
        updateSlideIndices();
      }
    });
  }
  
  // Move slide down
  const moveDownBtn = slide.querySelector('.slide-move-down');
  if (moveDownBtn) {
    moveDownBtn.addEventListener('click', () => {
      const nextSlide = slide.nextElementSibling;
      if (nextSlide && nextSlide.classList.contains('slide')) {
        slide.parentNode.insertBefore(nextSlide, slide);
        updateSlideIndices();
      }
    });
  }
  
  // Duplicate slide
  const duplicateBtn = slide.querySelector('.slide-duplicate');
  if (duplicateBtn) {
    duplicateBtn.addEventListener('click', () => {
      const clone = slide.cloneNode(true);
      slide.parentNode.insertBefore(clone, slide.nextSibling);
      addSlideButtonHandlers(clone);
      updateSlideIndices();
    });
  }
  
  // Delete slide
  const deleteBtn = slide.querySelector('.slide-delete');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      // Prevent deleting if it's the only slide
      const totalSlides = document.querySelectorAll('.slide').length;
      if (totalSlides <= 1) {
        toast({
          title: "Cannot Delete",
          description: "You must have at least one slide in your deck.",
        });
        return;
      }
      
      slide.remove();
      updateSlideIndices();
    });
  }
}

// Update the data-slide-index attributes after reordering
function updateSlideIndices() {
  document.querySelectorAll('.slide').forEach((slide, index) => {
    slide.setAttribute('data-slide-index', index.toString());
  });
}

// Export the pitch deck
function exportPitchDeck() {
  // Collect all slide data
  const slides = [];
  document.querySelectorAll('.slide').forEach(slide => {
    const title = slide.querySelector('.slide-title').textContent;
    const content = slide.querySelector('.slide-body').textContent;
    slides.push({ title, content });
  });
  
  // Get the current style
  const slidesContainer = document.querySelector('.slides-container');
  let style = 'minimal';
  if (slidesContainer) {
    if (slidesContainer.classList.contains('template-tech')) {
      style = 'tech';
    } else if (slidesContainer.classList.contains('template-impact')) {
      style = 'impact';
    }
  }
  
  // Save the deck to localStorage for demo purposes
  localStorage.setItem('savedPitchDeck', JSON.stringify({
    slides,
    style,
    savedAt: new Date().toISOString()
  }));
  
  // Show export options and message
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
  modal.id = 'export-modal';
  
  modal.innerHTML = `
    <div class="bg-background p-4 rounded-md shadow-xl w-96 max-w-full">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">Export Pitch Deck</h3>
        <button id="close-export-modal" class="text-muted-foreground hover:text-foreground">&times;</button>
      </div>
      
      <p class="text-sm mb-4">Your pitch deck is ready for export. Choose your preferred format:</p>
      
      <div class="space-y-3">
        <button class="export-option w-full text-left p-2 border border-border rounded-md hover:border-primary hover:bg-muted/50 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          Export as PDF
        </button>
        <button class="export-option w-full text-left p-2 border border-border rounded-md hover:border-primary hover:bg-muted/50 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
          Export as PowerPoint
        </button>
        <button class="export-option w-full text-left p-2 border border-border rounded-md hover:border-primary hover:bg-muted/50 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
          Share URL
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add event listeners
  setTimeout(() => {
    const closeBtn = document.getElementById('close-export-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.remove();
      });
    }
    
    document.querySelectorAll('.export-option').forEach(option => {
      option.addEventListener('click', () => {
        modal.remove();
        
        toast({
          title: "Export Complete",
          description: "Your pitch deck has been exported successfully.",
        });
        
        // Close the pitch deck creator
        const pitchModal = document.getElementById('pitch-deck-modal');
        if (pitchModal) {
          pitchModal.remove();
        }
      });
    });
  }, 100);
}

// Sample extensions data with local image paths and actual functionality
const allExtensions: Extension[] = [
  // Theme extensions - users need to install these to change the website's look
  {
    id: "midnight-aura-theme",
    name: "Midnight Aura",
    publisher: "Semicolon",
    description: "Deep purple-tinged dark theme with enhanced visual hierarchy",
    icon: "/extensions/dark-theme-icon.png",
    version: "1.2.0",
    downloads: 2456789,
    rating: 4.8,
    categories: ["Themes"],
    tags: ["dark", "purple", "productivity"],
    price: "Free",
    installed: false,
    enabled: false,
    extensionType: "theme",
    themeColors: {
      "--vscode-sidebar-background": "#0F0B16",
      "--vscode-editor-background": "#181022",
      "--vscode-terminal-background": "#120C18",
      "--primary-color": "#7D4EFF",
      "--background": "#130D1A",
      "--foreground": "#E8E0F5",
      "--vscode-statusBar-background": "#20152E",
      "--vscode-editor-foreground": "#D8CDFF",
    },
    preview: "/extensions/dark-theme-preview.png",
    onEnable: () => {
      toast({
        title: "Midnight Aura Activated",
        description: "Immersive purple-dark environment enabled",
      });
      // Dispatch theme change event
      window.dispatchEvent(
        new CustomEvent("extension-theme-changed", {
          detail: {
            isUsingExtensionTheme: true,
            themeColors: {
              "--vscode-sidebar-background": "#0F0B16",
              "--vscode-editor-background": "#181022",
              "--vscode-terminal-background": "#120C18",
              "--primary-color": "#7D4EFF",
              "--background": "#130D1A",
              "--foreground": "#E8E0F5",
              "--vscode-statusBar-background": "#20152E",
              "--vscode-editor-foreground": "#D8CDFF",
            },
          },
        })
      );
    },
    onDisable: () => {
      window.dispatchEvent(
        new CustomEvent("extension-theme-changed", {
          detail: {
            isUsingExtensionTheme: false,
          },
        })
      );
    },
  },
  {
    id: "light-theme",
    name: "Light Theme",
    publisher: "Semicolon",
    description: "A clean, light theme for those who prefer bright interfaces",
    icon: "/extensions/light-theme-icon.png",
    version: "1.0.2",
    downloads: 1356435,
    rating: 4.6,
    categories: ["Themes"],
    tags: ["light", "theme", "bright"],
    price: "Free",
    installed: false,
    enabled: false,
    extensionType: "theme",
    themeColors: {
      "--vscode-sidebar-background": "#f5f5f5",
      "--vscode-editor-background": "#ffffff",
      "--vscode-terminal-background": "#f8f8f8",
      "--primary-color": "#007acc",
      "--background": "#ffffff",
      "--foreground": "#333333"
    },
    preview: "/extensions/light-theme-preview.png",
    onEnable: () => {
      toast({
        title: "Light Theme Enabled",
        description: "Light Theme has been applied to the workspace.",
      });
    }
  },
  {
    id: "plasma-surge",
    name: "Plasma Surge",
    publisher: "Semicolon",
    description: "Electric, high-energy theme with vibrant contrasts for coding that pops",
    icon: "/extensions/plasma-theme-icon.png",
    version: "2.3.1",
    downloads: 786532,
    rating: 4.7,
    categories: ["Themes"],
    tags: ["electric", "vibrant", "dark"],
    price: "Free",
    installed: false,
    enabled: false,
    extensionType: "theme",
    themeColors: {
      "--vscode-sidebar-background": "#0F172A",
      "--vscode-editor-background": "#06051F",
      "--vscode-terminal-background": "#151432",
      "--primary-color": "#00FFAA",
      "--background": "#06051F",
      "--foreground": "#C8F4FF"
    },
    preview: "/extensions/plasma-theme-preview.png",
    onEnable: () => {
      toast({
        title: "Plasma Surge Enabled",
        description: "The electric theme has been applied. Code with electrifying energy!",
      });
    }
  },
  
  // Hackathon-specific extensions with actual functionality
  {
    id: "hackathon-timer",
    name: "Hackathon Timer",
    publisher: "Semicolon",
    description: "Countdown timer for hackathon deadlines with notifications and milestone tracking",
    icon: "/extensions/hackathon-timer-icon.png",
    version: "2.1.0",
    downloads: 87432,
    rating: 4.9,
    categories: ["Hackathon", "Tools"],
    tags: ["timer", "deadline", "tracking"],
    price: "Free",
    installed: false,
    enabled: false,
    extensionType: "feature",
    features: ["countdown", "milestone-tracking", "notifications"],
    configurable: true,
    preview: "/extensions/hackathon-timer-preview.png",
    onEnable: () => {
      // Create and add the timer to the DOM
      const { element, interval } = createTimerElement();
      document.body.appendChild(element);
      
      // Declare type for window
      // Store interval ID as a number to clear it later
      const intervalId = Number(interval);
      (window as any).hackathonTimerInterval = intervalId;
      
      toast({
        title: "Hackathon Timer Enabled",
        description: "The countdown timer is now active.",
      });
    },
    onDisable: () => {
      // Remove timer from DOM and clear interval
      const timerElement = document.getElementById('hackathon-timer');
      if (timerElement) {
        if (window.hackathonTimerInterval) {
          clearInterval(window.hackathonTimerInterval);
        }
        timerElement.remove();
      }
    },
    onUninstall: () => {
      // Ensure the timer is removed when uninstalled
      const timerElement = document.getElementById('hackathon-timer');
      if (timerElement) {
        if (window.hackathonTimerInterval) {
          clearInterval(window.hackathonTimerInterval);
        }
        timerElement.remove();
      }
    }
  },
  {
    id: "team-hub",
    name: "Team Hub",
    publisher: "Semicolon",
    description: "Team collaboration hub with task assignments, progress tracking, and communication tools",
    icon: "/extensions/team-hub-icon.png",
    version: "3.0.5",
    downloads: 56789,
    rating: 4.8,
    categories: ["Hackathon", "Collaboration"],
    tags: ["team", "tasks", "communication"],
    price: "Free",
    installed: false,
    enabled: false,
    extensionType: "feature",
    features: ["task-board", "team-chat", "file-sharing"],
    configurable: true,
    preview: "/extensions/team-hub-preview.png",
    onEnable: () => {
      // Add the team panel to the DOM
      const teamPanel = createTeamPanel();
      document.body.appendChild(teamPanel);
      
      toast({
        title: "Team Hub Enabled",
        description: "Team collaboration panel is now available.",
      });
    },
    onDisable: () => {
      // Remove team panel
      const panel = document.getElementById('team-hub-panel');
      if (panel) panel.remove();
    },
    onUninstall: () => {
      // Ensure panel is removed when uninstalled
      const panel = document.getElementById('team-hub-panel');
      if (panel) panel.remove();
    }
  },
  {
    id: "api-tester",
    name: "API Tester",
    publisher: "Semicolon",
    description: "Test API endpoints and validate responses directly within the hackathon platform",
    icon: "/extensions/api-tester-icon.png",
    version: "1.5.2",
    downloads: 67832,
    rating: 4.8,
    categories: ["Hackathon", "Developer Tools"],
    tags: ["api", "testing", "development"],
    price: "Free",
    installed: false,
    enabled: false,
    extensionType: "tool",
    features: ["request-builder", "response-validation", "history"],
    configurable: true,
    preview: "/extensions/api-tester-preview.png",
    onEnable: () => {
      // Create and add API tester UI
      const apiTester = createApiTester();
      document.body.appendChild(apiTester);
      
      toast({
        title: "API Tester Enabled",
        description: "You can now test API endpoints directly from the platform.",
      });
    },
    onDisable: () => {
      // Remove API tester
      const tester = document.getElementById('api-tester');
      if (tester) tester.remove();
    },
    onUninstall: () => {
      // Ensure API tester is removed
      const tester = document.getElementById('api-tester');
      if (tester) tester.remove();
    }
  },
  {
    id: "retro-wave",
    name: "Retro Wave Theme",
    publisher: "RetroStudio",
    description: "1980s-inspired theme with synthwave colors and neon accents",
    icon: "/extensions/retro-wave-icon.png",
    version: "2.1.0",
    downloads: 358741,
    rating: 4.8,
    categories: ["Themes"],
    tags: ["retro", "80s", "synthwave"],
    price: "Free",
    installed: false,
    enabled: false,
    extensionType: "theme",
    themeColors: {
      "--vscode-sidebar-background": "#241b2f",
      "--vscode-editor-background": "#262335",
      "--vscode-terminal-background": "#2d2b42",
      "--primary-color": "#ff7edb",
      "--background": "#262335",
      "--foreground": "#f4d5ff"
    },
    preview: "/extensions/retro-wave-preview.png",
    onEnable: () => {
      toast({
        title: "Retro Wave Theme Enabled",
        description: "Get ready to code like it's 1985!",
      });
      
      // Add some synthwave style animations (subtle)
      const styleElement = document.createElement('style');
      styleElement.id = 'retro-wave-styles';
      styleElement.innerHTML = `
        @keyframes neonGlow {
          0% { text-shadow: 0 0 5px rgba(255, 126, 219, 0.7), 0 0 10px rgba(255, 126, 219, 0.5); }
          50% { text-shadow: 0 0 10px rgba(255, 126, 219, 0.9), 0 0 20px rgba(255, 126, 219, 0.7); }
          100% { text-shadow: 0 0 5px rgba(255, 126, 219, 0.7), 0 0 10px rgba(255, 126, 219, 0.5); }
        }
        
        h1, h2, h3 {
          animation: neonGlow 2s infinite;
        }
      `;
      document.head.appendChild(styleElement);
    },
    onDisable: () => {
      // Remove any special styles
      const styles = document.getElementById('retro-wave-styles');
      if (styles) styles.remove();
    }
  },
  {
    id: "code-reviewer",
    name: "Code Reviewer",
    publisher: "CodeQuality",
    description: "AI-powered code review for hackathon projects with suggestions for improvement",
    icon: "/extensions/code-reviewer-icon.png",
    version: "2.0.3",
    downloads: 41789,
    rating: 4.7,
    categories: ["Hackathon", "Developer Tools"],
    tags: ["code", "review", "ai"],
    price: "Free",
    installed: false,
    enabled: false,
    extensionType: "tool",
    features: ["syntax-check", "best-practices", "security-scan"],
    configurable: true,
    preview: "/extensions/code-reviewer-preview.png",
    onEnable: () => {
      // Add a review button to code areas
      const addReviewButtons = () => {
        // Find any code elements (simulating the hackathon platform's code areas)
        document.querySelectorAll('pre, textarea').forEach(el => {
          // Check if we already added a review button to this element
          if (!el.nextElementSibling?.classList.contains('code-review-button')) {
            const reviewBtn = document.createElement('button');
            reviewBtn.className = 'code-review-button bg-primary text-primary-foreground text-xs px-2 py-1 rounded mt-1';
            reviewBtn.innerText = 'Review Code';
            reviewBtn.addEventListener('click', () => {
              toast({
                title: "Code Review",
                description: "Analysis complete! Your code looks good, with 2 minor issues detected.",
              });
              
              // Create a simple review result
              const reviewResult = document.createElement('div');
              reviewResult.className = 'code-review-result mt-2 p-2 border border-yellow-500 rounded text-sm';
              reviewResult.innerHTML = `
                <div class="font-medium mb-1">Code Review Results:</div>
                <ul class="list-disc pl-4 text-xs">
                  <li class="text-yellow-500">Consider adding error handling for edge cases</li>
                  <li class="text-yellow-500">Variable 'data' is declared but never used</li>
                  <li class="text-green-500">Good use of async/await pattern</li>
                </ul>
              `;
              
              // Insert after the button
              reviewBtn.insertAdjacentElement('afterend', reviewResult);
              
              // Remove the button to avoid multiple reviews
              reviewBtn.remove();
            });
            
            // Insert the button after the code element
            el.insertAdjacentElement('afterend', reviewBtn);
          }
        });
      };
      
      // Run initially and set up a mutation observer to add review buttons to new code areas
      addReviewButtons();
      window.codeReviewObserver = new MutationObserver(addReviewButtons);
      window.codeReviewObserver.observe(document.body, { childList: true, subtree: true });
      
      toast({
        title: "Code Reviewer Enabled",
        description: "You can now review your code for quality and best practices.",
      });
    },
    onDisable: () => {
      // Clean up the observer and remove any review buttons
      if (window.codeReviewObserver) {
        window.codeReviewObserver.disconnect();
      }
      
      document.querySelectorAll('.code-review-button, .code-review-result').forEach(el => {
        el.remove();
      });
    },
    onUninstall: () => {
      // Ensure we clean up all remnants
      if (window.codeReviewObserver) {
        window.codeReviewObserver.disconnect();
      }
      
      document.querySelectorAll('.code-review-button, .code-review-result').forEach(el => {
        el.remove();
      });
    }
  },
  {
    id: "pitch-deck",
    name: "Pitch Deck Creator",
    publisher: "PresentAI",
    description: "Create professional hackathon pitch decks with customizable templates and themes",
    icon: "/extensions/pitch-deck-icon.png",
    version: "1.2.3",
    downloads: 34892,
    rating: 4.7,
    categories: ["Hackathon", "Presentation"],
    tags: ["pitch", "presentation", "slides"],
    price: "Free",
    installed: false,
    enabled: false,
    extensionType: "feature",
    features: ["templates", "slide-builder", "export-pdf"],
    configurable: true,
    preview: "/extensions/pitch-deck-preview.png",
    onEnable: () => {
      // Add a pitch deck button to the UI
      const button = document.createElement('button');
      button.id = 'pitch-deck-button';
      button.className = 'fixed bottom-20 right-4 bg-primary text-primary-foreground p-2 rounded-md shadow-md z-50 text-sm flex items-center';
      button.innerHTML = '<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> Create Pitch Deck';
      
      button.addEventListener('click', () => {
        toast({
          title: "Pitch Deck Creator",
          description: "Opening pitch deck creator...",
        });
        
        // Create a fully interactive pitch deck creator
        const modal = createPitchDeckCreator();
        document.body.appendChild(modal);
      });
      
      document.body.appendChild(button);
      
      toast({
        title: "Pitch Deck Creator Enabled",
        description: "You can now create beautiful pitch decks for your hackathon project.",
      });
    },
    onDisable: () => {
      // Remove the pitch deck button
      const button = document.getElementById('pitch-deck-button');
      if (button) button.remove();
      
      // Remove any open modals
      const modal = document.getElementById('pitch-deck-modal');
      if (modal) modal.remove();
    }
  },
  {
    id: "ideation-board",
    name: "Ideation Board",
    publisher: "BrainstormHQ",
    description: "Digital whiteboard for brainstorming and organizing hackathon project ideas",
    icon: "/extensions/ideation-board-icon.png",
    version: "2.4.0",
    downloads: 45392,
    rating: 4.6,
    categories: ["Hackathon", "Planning"],
    tags: ["brainstorming", "ideas", "planning"],
    price: "Free",
    installed: false,
    enabled: false,
    extensionType: "feature",
    features: ["mind-mapping", "sticky-notes", "voting"],
    configurable: true,
    preview: "/extensions/ideation-board-preview.png",
    onEnable: () => {
      // Add a floating button to open the ideation board
      const button = document.createElement('button');
      button.id = 'ideation-board-button';
      button.className = 'fixed bottom-32 right-4 bg-primary text-primary-foreground p-2 rounded-md shadow-md z-50 text-sm flex items-center';
      button.innerHTML = '<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg> Open Ideation Board';
      
      button.addEventListener('click', () => {
        toast({
          title: "Ideation Board",
          description: "Opening brainstorming workspace...",
        });
        
        // Create a simple ideation board
        const board = createIdeationBoard();
        document.body.appendChild(board);
      });
      
      document.body.appendChild(button);
      
      toast({
        title: "Ideation Board Enabled",
        description: "You can now brainstorm and organize your hackathon ideas visually.",
      });
    },
    onDisable: () => {
      // Remove the ideation board button and any open boards
      const button = document.getElementById('ideation-board-button');
      if (button) button.remove();
      
      const board = document.getElementById('ideation-board');
      if (board) board.remove();
      
      const styles = document.getElementById('ideation-board-styles');
      if (styles) styles.remove();
    },
    onUninstall: () => {
      // Ensure all components are removed
      const button = document.getElementById('ideation-board-button');
      if (button) button.remove();
      
      const board = document.getElementById('ideation-board');
      if (board) board.remove();
      
      const styles = document.getElementById('ideation-board-styles');
      if (styles) styles.remove();
    }
  }
];

// Register all extensions in the registry
export const MarketplaceSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExtensions, setFilteredExtensions] = useState(allExtensions);
  
  // Register all extensions on component mount
  useEffect(() => {
    allExtensions.forEach(extension => {
      registerExtension(extension);
    });
  }, []);
  
  // Filter extensions based on search query
  useEffect(() => {
    const filtered = allExtensions.filter(ext =>
      ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ext.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ext.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ext.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredExtensions(filtered);
  }, [searchQuery]);
  
  return (
    <div className="p-4">
      <div className="mb-4 relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search extensions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExtensions.map((extension) => (
          <MarketplaceExtension key={extension.id} extension={extension} />
        ))}
      </div>
    </div>
  );
};

export default MarketplaceSection;