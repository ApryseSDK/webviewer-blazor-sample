#pragma checksum "C:\Users\Yon\Documents\blazor-sample\blazor-webviewer-sample\Shared\NavMenu.razor" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "a508362fc07111ff9e44b090cc884ccd73bf9d78"
// <auto-generated/>
#pragma warning disable 1591
#pragma warning disable 0414
#pragma warning disable 0649
#pragma warning disable 0169

namespace BlazorWebViewerServer.Shared
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Components;
#line 1 "C:\Users\Yon\Documents\blazor-sample\blazor-webviewer-sample\_Imports.razor"
using System.Net.Http;

#line default
#line hidden
#line 2 "C:\Users\Yon\Documents\blazor-sample\blazor-webviewer-sample\_Imports.razor"
using Microsoft.AspNetCore.Authorization;

#line default
#line hidden
#line 3 "C:\Users\Yon\Documents\blazor-sample\blazor-webviewer-sample\_Imports.razor"
using Microsoft.AspNetCore.Components.Forms;

#line default
#line hidden
#line 4 "C:\Users\Yon\Documents\blazor-sample\blazor-webviewer-sample\_Imports.razor"
using Microsoft.AspNetCore.Components.Routing;

#line default
#line hidden
#line 5 "C:\Users\Yon\Documents\blazor-sample\blazor-webviewer-sample\_Imports.razor"
using Microsoft.JSInterop;

#line default
#line hidden
#line 6 "C:\Users\Yon\Documents\blazor-sample\blazor-webviewer-sample\_Imports.razor"
using BlazorWebViewerServer;

#line default
#line hidden
#line 7 "C:\Users\Yon\Documents\blazor-sample\blazor-webviewer-sample\_Imports.razor"
using BlazorWebViewerServer.Shared;

#line default
#line hidden
    public class NavMenu : Microsoft.AspNetCore.Components.ComponentBase
    {
        #pragma warning disable 1998
        protected override void BuildRenderTree(Microsoft.AspNetCore.Components.RenderTree.RenderTreeBuilder builder)
        {
        }
        #pragma warning restore 1998
#line 33 "C:\Users\Yon\Documents\blazor-sample\blazor-webviewer-sample\Shared\NavMenu.razor"
       
    bool collapseNavMenu = true;

    string NavMenuCssClass => collapseNavMenu ? "collapse" : null;

    void ToggleNavMenu()
    {
        collapseNavMenu = !collapseNavMenu;
    }

#line default
#line hidden
    }
}
#pragma warning restore 1591